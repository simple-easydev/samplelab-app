import { useState } from 'react';
import {
  DASHBOARD_TABS,
  DiscoverTabContent,
  PacksTabContent,
  SamplesTabContent,
  CreatorsTabContent,
  GenresTabContent,
} from './DashboardTabContent';

function DashboardTabs({
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

/**
 * Dashboard view for unsubscribed users: browse and discover content with CTAs to subscribe.
 */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>(DASHBOARD_TABS[0].id);

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 w-full max-w-full">
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-6xl mx-auto">
          {activeTab === 'discover' && <DiscoverTabContent />}
          {activeTab === 'packs' && <PacksTabContent />}
          {activeTab === 'samples' && <SamplesTabContent />}
          {activeTab === 'creators' && <CreatorsTabContent />}
          {activeTab === 'genres' && <GenresTabContent />}
        </div>
      </div>
    </div>
  );
}
