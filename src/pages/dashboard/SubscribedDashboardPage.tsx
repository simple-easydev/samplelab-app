import { useEffect, useState } from 'react';
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

function SubscribedTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  return (
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
  );
}

export default function SubscribedDashboardPage() {
  const { isTrialing } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>(DASHBOARD_TABS[0].id);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUserCredits().then((n) => {
      if (!cancelled) setCredits(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 w-full max-w-full">
        <div className="max-w-6xl mx-auto mb-8 rounded-lg bg-[#161410] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#e8e2d2] text-base font-medium">
              Welcome back. You have full access to the library.
            </p>
            {isTrialing && (
              <p className="text-[#e8e2d2] text-sm mt-1 opacity-90">
                You're on a free trial. Subscribe to keep access after it ends.
              </p>
            )}
          </div>
          <p className="text-[#e8e2d2] text-sm">
            Credits: <span className="font-semibold text-white">{credits ?? '—'}</span>
          </p>
        </div>

        <SubscribedTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="max-w-6xl mx-auto">
          {activeTab === 'discover' && <DiscoverTabContent variant="subscribed" />}
          {activeTab === 'packs' && <PacksTabContent />}
          {activeTab === 'samples' && <SamplesTabContent />}
          {activeTab === 'creators' && <CreatorsTabContent />}
          {activeTab === 'genres' && <GenresTabContent />}
        </div>
      </div>
    </div>
  );
}
