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

/**
 * Get the current user's customer_id
 */
async function getCustomerId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ getCustomerId: No user found');
      return null;
    }

    console.log('🔍 getCustomerId: Looking up customer for user:', user.id);

    // Query the customers table to get customer_id for this user
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('❌ getCustomerId: Error fetching customer_id:', error);
      return null;
    }

    if (!data?.id) {
      console.log('❌ getCustomerId: No customer record found for user:', user.id);
      return null;
    }

    console.log('✅ getCustomerId: Found customer:', data.id);
    return data.id;
  } catch (error) {
    console.error('❌ getCustomerId: Exception:', error);
    return null;
  }
}

/**
 * Get the current user's active subscription
 */
export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const customerId = await getCustomerId();
    
    if (!customerId) {
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .in('stripe_status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No subscription found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
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
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ User not authenticated');
      return { error: 'User not authenticated' };
    }

    console.log('✅ User authenticated:', user.id);

    // Get customer_id for this user
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
      // isTrial = true: send boolean for edge function to handle (3-day free trial)
      // isTrial = false: send boolean for edge function to handle (immediate charge + bonus)
      isTrial: isTrial,
      successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/onboarding`,
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
 * Get user's remaining credits (if you have a credits system)
 */
export async function getUserCredits(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }

    // Assuming you have a user_credits table or it's in user metadata
    const credits = user.user_metadata?.credits || 0;
    return credits;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId },
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
