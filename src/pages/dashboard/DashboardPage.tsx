import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import {
  DASHBOARD_TABS,
  DiscoverTabContent,
  PacksTabContent,
  SamplesTabContent,
  CreatorsTabContent,
  GenresTabContent,
} from './DashboardTabContent';

type DashboardTabId = (typeof DASHBOARD_TABS)[number]['id'];

function DashboardTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTabId;
  onTabChange: (tabId: DashboardTabId) => void;
}) {
  return (
    <div className="border-b border-[#e8e2d2] overflow-x-auto overflow-y-hidden md:overflow-visible max-w-6xl mb-8 -mx-4 px-4 md:mx-auto md:px-0">
      <div className="flex gap-4 items-center flex-nowrap min-w-max md:min-w-0">
        {DASHBOARD_TABS.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
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
    </div>
  );
}

export interface DashboardPageProps {
  /** Tab from URL segment (e.g. samples, packs). When set, tab is controlled by route. */
  tabFromUrl?: DashboardTabId;
  /** True when path is /dashboard/:tabName/search */
  isSearch?: boolean;
}

/**
 * Single dashboard for all users. Same tabs for everyone; subscribed users see
 * welcome/credits banner and personalized discover content (e.g. similar samples).
 * URL: /dashboard/:tabName and /dashboard/:tabName/search?q=...&genre=...
 */
export default function DashboardPage({ tabFromUrl, isSearch = false }: DashboardPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isActive, isTrialing } = useSubscription();
  const [credits, setCredits] = useState<number | null>(null);

  console.log({ isTrialing, credits})

  const activeTab: DashboardTabId = tabFromUrl ?? DASHBOARD_TABS[0].id;

  const handleTabChange = (tabId: DashboardTabId) => {
    const base = `/dashboard/${tabId}`;
    const path = isSearch ? `${base}/search` : base;
    const query = searchParams.toString();
    navigate(query ? `${path}?${query}` : path);
  };

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;
    getUserCredits().then((n) => {
      if (!cancelled) setCredits(n);
    });
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  return (
    <div className="min-h-screen bg-[#fffbf0] z-0">
      <div className="px-4 py-4 md:px-8 md:pt-8 md:pb-32 w-full max-w-full">
        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="max-w-6xl mx-auto">
          {activeTab === 'discover' && (
            <DiscoverTabContent variant={isActive ? 'subscribed' : 'default'} />
          )}
          {activeTab === 'packs' && <PacksTabContent />}
          {activeTab === 'samples' && <SamplesTabContent />}
          {activeTab === 'creators' && <CreatorsTabContent />}
          {activeTab === 'genres' && <GenresTabContent />}
        </div>
      </div>
    </div>
  );
}
