import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { authManager } from '@/lib/supabase/auth-manager';

const DASHBOARD_TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, isActive, isTrialing, loading } = useSubscription();
  const [credits, setCredits] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>(DASHBOARD_TABS[0].id);

  // Fetch user credits from customers table
  useEffect(() => {
    const fetchCredits = async () => {
      const creditBalance = await getUserCredits();
      setCredits(creditBalance);
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    console.log({ loading, isActive })
  }, [loading, isActive, isTrialing]);

  useEffect(() => {
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Payment successful - refresh session to get updated metadata, then update onboarding
      const handlePaymentSuccess = async () => {
        try {
          console.log('💳 Payment successful, refreshing session to get updated metadata...');
          
          // First, refresh the session to get latest data from server
          const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !session?.user) {
            console.error('Error refreshing session:', refreshError);
            return;
          }
          
          const user = session.user;
          console.log('✅ Got fresh session, metadata:', user.user_metadata);


          await authManager.refreshUserData();

          
        } catch (error) {
          console.error('Error in handlePaymentSuccess:', error);
        }
      };

      handlePaymentSuccess().then(async () => {
        // Refresh credits from database (webhook should have updated it)
        const creditBalance = await getUserCredits();
        setCredits(creditBalance);

        // Clean up URL
        setSearchParams({}, { replace: true });
      });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 w-full max-w-full">
        {/* Tab menu - Figma PrimaryTab / tabs */}
        <div className="border-b border-[#e8e2d2] flex gap-4 items-center w-full mb-8">
          {DASHBOARD_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-12 items-center justify-center px-2 shrink-0 font-medium text-base leading-6 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-b-2 border-[#161410] text-[#161410]'
                    : 'border-b-2 border-transparent text-[#7f7766] hover:text-[#161410]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

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
