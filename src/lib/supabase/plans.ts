import { supabase } from './client';

/**
 * Plan tier as returned by get_stripe_products RPC.
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
  visible_onboarding?: boolean;
}

export interface GetStripePlansOptions {
  /** When true, only return plans with visible_onboarding = true. Passed as RPC arg. */
  visible_onboarding?: boolean;
}

/**
 * Fetch Stripe plans via RPC get_stripe_products.
 * Pass options.visible_onboarding = true to only get plans shown on onboarding.
 * RPC args: { visible_onboarding?: boolean }. Returns plans array or { plans: PlanTierPublic[] }.
 */
export async function getStripePlans(options?: GetStripePlansOptions): Promise<PlanTierPublic[]> {
  const params = { visible_onboarding: options?.visible_onboarding };
    console.log({ params })
  const { data, error } = await supabase.rpc('get_stripe_products', params);

  if (error) {
    console.error('Error fetching Stripe plans:', error);
    return [];
  }

  const plans = Array.isArray(data) ? data : (data as { plans?: PlanTierPublic[] })?.plans;
  if (!Array.isArray(plans)) {
    return [];
  }

  return plans;
}
