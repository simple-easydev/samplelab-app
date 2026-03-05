import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { invalidateBillingInfoCache } from '@/lib/supabase/subscriptions';
import { supabase } from '@/lib/supabase/client';
import { authManager } from '@/lib/supabase/auth-manager';
import DashboardPage from './DashboardPage';
import SubscribedDashboardPage from './SubscribedDashboardPage';

/**
 * Renders the appropriate dashboard based on subscription status:
 * - Subscribed (active or trialing) → SubscribedDashboardPage
 * - Unsubscribed → DashboardPage (browse view)
 * Also handles Stripe checkout return (session_id) and refreshes billing/subscription.
 */
export default function DashboardRouter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isActive, loading, refresh: refreshSubscription } = useSubscription();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    const handlePaymentSuccess = async () => {
      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !session?.user) {
          console.error('Error refreshing session:', refreshError);
          return;
        }
        await authManager.refreshUserData();
        invalidateBillingInfoCache();
        refreshSubscription();
      } catch (error) {
        console.error('Error in handlePaymentSuccess:', error);
      } finally {
        setSearchParams({}, { replace: true });
      }
    };

    handlePaymentSuccess();
  }, [searchParams, setSearchParams, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
        <p className="text-[#7f7766]">Loading…</p>
      </div>
    );
  }

  return isActive ? <SubscribedDashboardPage /> : <DashboardPage />;
}
