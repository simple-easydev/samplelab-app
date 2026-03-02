import { supabase } from './client';

/**
 * Subscription status types (from Stripe)
 */
export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete' 
  | 'incomplete_expired'
  | null;

/**
 * Subscription interface matching your database schema
 */
export interface Subscription {
  id: string;
  customer_id: string;
  tier: string;
  status: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  trial_start: string | null;
  trial_end: string | null;
}

/** RPC response shape from get_my_billing_info */
export interface BillingInfoResponse {
  customer: { id: string; credit_balance: number; [key: string]: unknown } | null;
  subscription: Subscription | null;
}

let billingInfoCache: { userId: string; data: BillingInfoResponse } | null = null;
let billingInfoPromise: Promise<BillingInfoResponse> | null = null;

/**
 * Fetch customer + subscription in one RPC call. Cached per user; in-flight requests deduplicated.
 * Requires authenticated session. Call once per session (or when needed); result is cached.
 */
export async function getBillingInfo(): Promise<BillingInfoResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    billingInfoCache = null;
    billingInfoPromise = null;
    return { customer: null, subscription: null };
  }

  if (billingInfoCache?.userId === userId) {
    return billingInfoCache.data;
  }

  if (billingInfoPromise) {
    return billingInfoPromise;
  }

  billingInfoPromise = (async () => {
    try {
      const { data, error } = await supabase.rpc('get_my_billing_info');
      if (error) {
        console.error('getBillingInfo RPC error:', error);
        return { customer: null, subscription: null };
      }
      const result: BillingInfoResponse = {
        customer: data?.customer ?? null,
        subscription: data?.subscription ?? null,
      };
      billingInfoCache = { userId, data: result };
      return result;
    } finally {
      billingInfoPromise = null;
    }
  })();

  return billingInfoPromise;
}

/** Clear billing info cache (e.g. after checkout, cancel, or upgrade so next read refetches). */
export function invalidateBillingInfoCache(): void {
  billingInfoCache = null;
  billingInfoPromise = null;
}

async function getCustomerId(): Promise<string | null> {
  const { customer } = await getBillingInfo();
  return customer?.id ?? null;
}

/**
 * Get the current user's active subscription (from single get_my_billing_info RPC, cached).
 */
export async function getUserSubscription(): Promise<Subscription | null> {
  const { subscription } = await getBillingInfo();
  return subscription ?? null;
}

/**
 * Check if user has an active subscription or trial
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getUserSubscription();
  return subscription !== null && 
    (subscription.stripe_status === 'active' || subscription.stripe_status === 'trialing');
}

/**
 * Check if user is currently in trial period
 */
export async function isInTrialPeriod(): Promise<boolean> {
  const subscription = await getUserSubscription();
  
  if (!subscription || subscription.stripe_status !== 'trialing') {
    return false;
  }

  if (subscription.trial_end) {
    const trialEnd = new Date(subscription.trial_end);
    return trialEnd > new Date();
  }

  return false;
}

/**
 * Create a Stripe checkout session
 * @param priceId - Stripe price ID for the subscription plan
 * @param isTrial - true = 3-day free trial, false = immediate charge with +50 bonus credits
 */
export async function createCheckoutSession(
  priceId: string,
  isTrial: boolean = true
): Promise<{ url: string } | { error: string }> {
  try {
    console.log('=== createCheckoutSession START ===');
    console.log('Price ID:', priceId);
    console.log('Use trial:', isTrial);
    console.log(isTrial ? '→ 3-day free trial (no charge)' : '→ Immediate charge + 50 bonus credits');
    
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      console.error('❌ User not authenticated');
      return { error: 'User not authenticated' };
    }

    console.log('✅ User authenticated:', user.id);

    // Get customer_id for this user (getCustomerId uses getSession, no extra auth call)
    const customerId = await getCustomerId();
    
    if (!customerId) {
      console.error('❌ Customer record not found for user:', user.id);
      return { error: 'Customer record not found' };
    }

    console.log('✅ Customer ID found:', customerId);

    const requestBody = {
      priceId,
      customerId,
      userId: user.id,
      email: user.email,
      // isTrial = true: 3-day free trial (no immediate charge, no bonus)
      // isTrial = false: Immediate charge with +50 bonus credits (backend determines this)
      isTrial: isTrial,
      successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
    };

    console.log('📤 Calling edge function with body:', requestBody);

    // Call the edge function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: requestBody,
    });

    console.log('📥 Edge function response - data:', data);
    console.log('📥 Edge function response - error:', error);

    if (error) {
      console.error('❌ Error from edge function:', error);
      return { error: error.message || 'Failed to create checkout session' };
    }

    if (!data) {
      console.error('❌ No data returned from edge function');
      return { error: 'No data returned from checkout session' };
    }

    if (!data.url) {
      console.error('❌ No URL in response. Full data:', data);
      return { error: 'No checkout URL returned' };
    }

    console.log('✅ Checkout URL received:', data.url);
    console.log('=== createCheckoutSession END ===');
    
    return { url: data.url };
  } catch (error) {
    console.error('❌ Exception in createCheckoutSession:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get user's remaining credits (from single get_my_billing_info RPC, cached).
 */
export async function getUserCredits(): Promise<number> {
  const { customer } = await getBillingInfo();
  return customer?.credit_balance ?? 0;
}

/**
 * Upgrade existing subscription to a new price (e.g. Starter → Pro).
 * Calls upgrade-subscription edge function with { priceId }.
 * Returns redirect URL if successful.
 */
export async function upgradeSubscription(priceId: string): Promise<{ url: string } | { error: string }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.access_token) {
      return { error: 'You must be signed in to upgrade' };
    }

    const { data, error } = await supabase.functions.invoke<{ url?: string }>('upgrade-subscription', {
      method: 'POST',
      body: { priceId },
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    });

    if (error) {
      return { error: error.message || 'Failed to upgrade' };
    }
    if (!data?.url) {
      return { error: 'No redirect URL returned' };
    }
    return { url: data.url };
  } catch (error: any) {
    console.error('Error upgrading subscription:', error);
    return { error: error.message || 'Failed to upgrade subscription' };
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.access_token) {
      console.error("You must be signed in to delete a plan");
      return { success: false, error: "You must be signed in to delete a plan" };
    }

    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId },
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: error.message || 'Failed to cancel subscription' };
  }
}
