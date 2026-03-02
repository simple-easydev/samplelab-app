import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { supabase } from '@/lib/supabase/client';
import { authManager } from '@/lib/supabase/auth-manager';
import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverListColumn } from '@/components/DiscoverListColumn';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';

const TRENDING_ITEMS = [
  { rank: 1, name: 'Sample name goes here', creator: 'Creator name' },
  { rank: 2, name: 'Lo-Fi Keys Loop', creator: 'Beat Lab' },
  { rank: 3, name: 'Trap Hi-Hat Sequence', creator: 'Sound Factory' },
  { rank: 4, name: 'Soul Chop 04', creator: 'Vinyl Revival' },
  { rank: 5, name: 'Synth Pad Texture', creator: 'Synth Wave' },
];

const NEW_RELEASES_ITEMS = [
  { rank: 1, name: 'Fresh Drop Vol. 1', creator: 'Beat Lab' },
  { rank: 2, name: 'Weekend Pack', creator: 'Sound Factory' },
  { rank: 3, name: 'Midnight Loops', creator: 'Vinyl Revival' },
  { rank: 4, name: '808 Essentials', creator: 'Synth Wave' },
  { rank: 5, name: 'Chill Vibes Pack', creator: 'Creator name' },
];

const CREATORS_ITEMS = [
  { rank: 1, name: 'Beat Lab', creator: '24 packs' },
  { rank: 2, name: 'Sound Factory', creator: '18 packs' },
  { rank: 3, name: 'Vinyl Revival', creator: '31 packs' },
  { rank: 4, name: 'Synth Wave', creator: '12 packs' },
  { rank: 5, name: 'Creator name', creator: '8 packs' },
];

const FEATURED_PACKS = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '20', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
];

const FEATURED_CREATORS = [
  { name: 'Creator Name Goes Here', followersCount: '100', packsCount: '10' },
  { name: 'Beat Lab', followersCount: '250', packsCount: '24' },
  { name: 'Sound Factory', followersCount: '180', packsCount: '18' },
  { name: 'Vinyl Revival', followersCount: '320', packsCount: '31' },
  { name: 'Synth Wave', followersCount: '95', packsCount: '12' },
  { name: 'Creator name', followersCount: '64', packsCount: '8' },
];

const TOP_GENRES = [
  { name: 'Hip-Hop' },
  { name: 'Drums' },
  { name: 'Boom Bap' },
  { name: 'Lo-Fi' },
  { name: 'Trap' },
  { name: 'Drill' },
  { name: 'Soul' },
];

const DASHBOARD_TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

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

function DiscoverTabContent() {
  return (
    <div className="mb-8 flex flex-col gap-8">
      <DiscoverCarousel />
      <div className="flex gap-6 items-start w-full">
        <DiscoverListColumn
          title="Trending samples"
          subtitle="The most downloaded samples right now"
          items={TRENDING_ITEMS}
          ctaLabel="View all Trending samples"
        />
        <DiscoverListColumn
          title="New releases"
          subtitle="Fresh samples added this week"
          items={NEW_RELEASES_ITEMS}
          ctaLabel="View new releases"
        />
        <DiscoverListColumn
          title="Top creators"
          subtitle="Most downloaded creators this month"
          items={CREATORS_ITEMS}
          ctaLabel="View all creators"
        />
      </div>
      <CardCarousel title="Featured Packs" ctaLabel="View all packs">
        {FEATURED_PACKS.map((pack) => (
          <SamplePackCard
            key={pack.title}
            title={pack.title}
            creator={pack.creator}
            playCount={pack.playCount}
            genre={pack.genre}
            premium={pack.premium}
          />
        ))}
      </CardCarousel>
      <CardCarousel title="Featured creators" ctaLabel="View all creators">
        {FEATURED_CREATORS.map((creator) => (
          <CreatorCard
            key={creator.name}
            name={creator.name}
            followersCount={creator.followersCount}
            packsCount={creator.packsCount}
          />
        ))}
      </CardCarousel>
      <CardCarousel title="Top genres" ctaLabel="View all genres">
        {TOP_GENRES.map((genre) => (
          <GenreCard key={genre.name} name={genre.name} />
        ))}
      </CardCarousel>
    </div>
  );
}

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isActive, isTrialing, loading } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>(DASHBOARD_TABS[0].id);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    console.log({ loading, isActive })
  }, [loading, isActive, isTrialing]);

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
        // Clean up URL
        setSearchParams({}, { replace: true });
      });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 w-full max-w-full">
        {loading ? (
          <div className="max-w-6xl mx-auto py-12 flex items-center justify-center text-[#7f7766]">
            Loading…
          </div>
        ) : (
          <>
            {isActive && (
              <div className="max-w-6xl mx-auto mb-8 rounded-lg bg-[#161410] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[#e8e2d2] text-base font-medium">
                  Welcome back. You have full access to the library.
                </p>
                <p className="text-[#e8e2d2] text-sm">
                  Credits: <span className="font-semibold text-white">{credits ?? '—'}</span>
                </p>
              </div>
            )}
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="max-w-6xl mx-auto">
              {activeTab === 'discover' && <DiscoverTabContent />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
