import { useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { invalidateBillingInfoCache } from '@/lib/supabase/subscriptions';
import { supabase } from '@/lib/supabase/client';
import { authManager } from '@/lib/supabase/auth-manager';
import DashboardPage from './DashboardPage';
import SearchResultPage from './SearchResultPage';
import PackDetailPage from './PackDetailPage';
import CreatorDetailPage from './CreatorDetailPage';
import { DASHBOARD_TABS } from './DashboardTabContent';

type DashboardTabId = (typeof DASHBOARD_TABS)[number]['id'];
const VALID_TAB_IDS = new Set<string>(DASHBOARD_TABS.map((t) => t.id));

/**
 * Resolves tab name from URL param; returns valid tab id or null.
 */
function getValidTab(tabName: string | undefined): DashboardTabId | null {
  if (!tabName || !VALID_TAB_IDS.has(tabName)) return null;
  return tabName as DashboardTabId;
}

/**
 * Renders the dashboard for all users. Handles Stripe checkout return (session_id),
 * URL structure /dashboard/:tabName and /dashboard/:tabName/search?q=...&genre=...
 */
export default function DashboardRouter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading, refresh: refreshSubscription } = useSubscription();

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
        navigate('/dashboard/discover', { replace: true });
      }
    };

    handlePaymentSuccess();
  }, [searchParams, navigate, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
        <p className="text-[#7f7766]">Loading…</p>
      </div>
    );
  }

  const q = searchParams.get('q');
  const hasLegacySearch = q != null && q.trim() !== '';
  const hasStripeSession = searchParams.has('session_id');

  return (
    <Routes>
      {/* /dashboard -> /dashboard/discover; /dashboard?q=... -> SearchResultPage; keep URL when session_id for Stripe */}
      <Route
        index
        element={
          hasStripeSession ? (
            <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
              <p className="text-[#7f7766]">Loading…</p>
            </div>
          ) : hasLegacySearch ? (
            <SearchResultPage />
          ) : (
            <Navigate to="/dashboard/discover" replace />
          )
        }
      />

      {/* /dashboard/packs/:packId — sample pack detail page */}
      <Route path="packs/:packId" element={<PackDetailPage />} />

      {/* /dashboard/creators/:creatorId — creator detail page */}
      <Route path="creators/:creatorId" element={<CreatorDetailPage />} />

      {/* /dashboard/:tabName — tab content, optional ?q= & ?genre= etc. */}
      <Route
        path=":tabName"
        element={<DashboardRoute />}
      />

      {/* /dashboard/:tabName/search — same tab with search params (e.g. ?q=drake, ?genre=hip-hop) */}
      <Route
        path=":tabName/search"
        element={<DashboardRoute isSearch />}
      />

      {/* Invalid or unknown path -> discover */}
      <Route path="*" element={<Navigate to="/dashboard/discover" replace />} />
    </Routes>
  );
}

/** Validates :tabName and renders DashboardPage with tab and optional search mode. */
function DashboardRoute({ isSearch = false }: { isSearch?: boolean }) {
  const { tabName } = useParams<{ tabName: string }>();
  const validTab = getValidTab(tabName);

  if (!validTab) {
    return <Navigate to="/dashboard/discover" replace />;
  }

  return <DashboardPage tabFromUrl={validTab} isSearch={isSearch} />;
}