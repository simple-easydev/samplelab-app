import { supabase } from './client';

/**
 * Plan tier as returned by get-stripe-products edge function
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
}

export interface GetStripePlansResponse {
  success: boolean;
  plans: PlanTierPublic[];
  count: number;
}

/**
 * Fetch Stripe plans from the get-stripe-products edge function
 */
export async function getStripePlans(): Promise<PlanTierPublic[]> {
  const { data, error } = await supabase.functions.invoke<GetStripePlansResponse>(
    'get-stripe-products',
    { method: 'GET' }
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
