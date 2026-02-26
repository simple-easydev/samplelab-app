import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { getUserCredits } from '@/lib/supabase/subscriptions';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, isActive, isTrialing, loading } = useSubscription();
  const [credits, setCredits] = useState<number>(0);

  // Fetch user credits from customers table
  useEffect(() => {
    const fetchCredits = async () => {
      const creditBalance = await getUserCredits();
      setCredits(creditBalance);
    };
    fetchCredits();
  }, []);

  // Check if user has pro plan selected but no active subscription (payment failed/canceled)
  useEffect(() => {
    const checkFailedPayment = async () => {
      // Wait for subscription loading to complete
      if (loading) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectedPlan = user.user_metadata?.selected_plan;
      const isProPlan = selectedPlan === 'pro-monthly' || selectedPlan === 'pro-yearly';
      
      // If user selected pro but has no active subscription, downgrade to free
      if (isProPlan && !isActive) {
        console.log('⚠️ User has pro plan selected but no active subscription - downgrading to free');
        
        const { error } = await supabase.auth.updateUser({
          data: {
            selected_plan: 'free',
            pending_bonus_credits: false,
          }
        });

        if (!error) {
          // Check if they explicitly canceled
          const canceled = searchParams.get('canceled');
          if (canceled) {
            toast.error('Payment was canceled. You\'ve been switched to the free plan.');
            // Clean up URL
            setSearchParams({}, { replace: true });
          } else {
            toast.info('Switched to free plan.');
          }
        }
      }
    };

    checkFailedPayment();
  }, [loading, isActive, searchParams, setSearchParams]);

  useEffect(() => {
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Payment successful - webhook will handle credit updates
      const handlePaymentSuccess = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            console.error('User not found');
            return;
          }
          
          console.log('Post-payment: Clearing pending_bonus_credits flag and completing onboarding');

          // Clear the pending bonus flag and mark onboarding complete (webhook already updated credits in DB)
          const { error } = await supabase.auth.updateUser({
            data: {
              onboarding_completed: true,
              pending_bonus_credits: false,
            }
          });

          if (error) {
            console.error('Error updating user metadata:', error);
          }
        } catch (error) {
          console.error('Error in handlePaymentSuccess:', error);
        }
      };

      handlePaymentSuccess().then(async () => {
        // Refresh credits from database (webhook should have updated it)
        const creditBalance = await getUserCredits();
        setCredits(creditBalance);
        
        const { data: { user } } = await supabase.auth.getUser();
        const hadPendingBonus = user?.user_metadata?.pending_bonus_credits;

        // Show success message
        if (isTrialing) {
          toast.success('🎉 Your 3-day free trial has started!');
        } else if (hadPendingBonus) {
          toast.success('🎉 Welcome to Pro! +50 bonus credits added to your account!');
        } else {
          toast.success('🎉 Welcome to Pro! Your subscription is active.');
        }
      });
      
      // Clean up URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, isTrialing]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with subscription status */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {!loading && subscription && (
              <div className="flex items-center gap-2">
                {isTrialing && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Trial Active
                  </Badge>
                )}
                {isActive && !isTrialing && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Pro Member
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Subscription info card */}
          {!loading && subscription && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    {isTrialing ? '🎉 Free Trial Active' : '✨ Pro Subscription'}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isTrialing && subscription.trial_end
                      ? `Your trial ends on ${new Date(subscription.trial_end).toLocaleDateString()}`
                      : !isTrialing && subscription.current_period_end
                      ? `Your subscription renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                      : 'Loading subscription details...'
                    }
                  </p>
                  {isTrialing && (
                    <p className="text-xs text-muted-foreground">
                      No charge until your trial ends. Cancel anytime.
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {subscription.stripe_status === 'trialing' ? '$0' : '$19.99'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.stripe_status === 'trialing' ? 'during trial' : 'per month'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Credits Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-purple-700 mb-2">
                Available Credits
              </h3>
              <p className="text-3xl font-bold text-purple-900">{credits}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Use credits to download samples
              </p>
            </div>

            {/* Overview Cards */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Active Samples
              </h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Pending Orders
              </h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Samples
              </h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
