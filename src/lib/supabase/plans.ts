import { supabase } from './client';

/**
 * Plan tier as returned by get-stripe-products edge function.
 * Only plans with visible_onboarding = true should be returned (filtered in edge function and here).
 */
export interface PlanTierPublic {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  billing_cycle: string;
  price: number;
  original_price: number | null;
  credits_monthly: number;
  is_popular: boolean;
  features: string[];
  sort_order: number;
  stripe_price_id: string | null;
  /** When true, plan is shown on onboarding. Backend should filter plans_tiers by this. */
  visible_onboarding?: boolean;
}

export interface GetStripePlansResponse {
  success: boolean;
  plans: PlanTierPublic[];
  count: number;
}

export interface GetStripePlansOptions {
  /** When true, only return plans with visible_onboarding = true. Passed in request body. */
  visible_onboarding?: boolean;
}

/**
 * Fetch Stripe plans from the get-stripe-products edge function.
 * Pass options.visible_onboarding = true to only get plans shown on onboarding.
 * (invoke() does not support query params; the edge function receives this in the request body.)
 */
export async function getStripePlans(options?: GetStripePlansOptions): Promise<PlanTierPublic[]> {
  const body = options?.visible_onboarding != null ? { visible_onboarding: options.visible_onboarding } : {};
  const { data, error } = await supabase.functions.invoke<GetStripePlansResponse>(
    'get-stripe-products',
    { method: 'POST', body }
  );

  if (error) {
    console.error('Error fetching Stripe plans:', error);
    return [];
  }

  if (!data?.success || !Array.isArray(data.plans)) {
    return [];
  }

  return data.plans;
}
