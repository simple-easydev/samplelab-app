import { useEffect, useState } from 'react';
import { getUserSubscription, type Subscription } from '@/lib/supabase/subscriptions';

/**
 * Hook to manage subscription state (fetched on mount and via refresh()).
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isTrialing, setIsTrialing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const sub = await getUserSubscription();
      const active =
        sub !== null &&
        (sub.stripe_status === 'active' || sub.stripe_status === 'trialing');
      const trialing =
        sub?.stripe_status === 'trialing' &&
        !!sub.trial_end &&
        new Date(sub.trial_end) > new Date();

      setSubscription(sub);
      setIsActive(active);
      setIsTrialing(trialing);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    isActive,
    isTrialing,
    loading,
    refresh: fetchSubscription,
  };
}
