import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, isActive, isTrialing, loading } = useSubscription();

  useEffect(() => {
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Mark onboarding as complete for Pro users returning from Stripe
      const completeOnboarding = async () => {
        try {
          const { error } = await supabase.auth.updateUser({
            data: {
              onboarding_completed: true,
            }
          });

          if (error) {
            console.error('Error completing onboarding:', error);
          } else {
            console.log('Onboarding marked as complete after Stripe checkout');
          }
        } catch (error) {
          console.error('Error updating user:', error);
        }
      };

      completeOnboarding();

      // Show success message
      if (isTrialing) {
        toast.success('🎉 Your 3-day free trial has started!');
      } else {
        toast.success('🎉 Welcome to Pro! Your subscription is active.');
      }
      
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
