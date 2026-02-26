import { useEffect, useState } from 'react';
import { 
  getUserSubscription, 
  hasActiveSubscription, 
  isInTrialPeriod,
  type Subscription 
} from '@/lib/supabase/subscriptions';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook to manage subscription state
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isTrialing, setIsTrialing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const [sub, active, trialing] = await Promise.all([
        getUserSubscription(),
        hasActiveSubscription(),
        isInTrialPeriod(),
      ]);

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

    // Subscribe to subscription changes via realtime
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
        },
        (payload) => {
          console.log('Subscription changed:', payload);
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    subscription,
    isActive,
    isTrialing,
    loading,
    refresh: fetchSubscription,
  };
}
