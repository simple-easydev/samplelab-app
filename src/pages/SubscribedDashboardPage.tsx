import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverListColumn } from '@/components/DiscoverListColumn';
import { SimilarSamplesSection } from '@/components/SimilarSamplesSection';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';
import { Download, Music2, Library } from 'lucide-react';

const SUBSCRIBED_TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'library', label: 'Your library' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

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

/** Pack name used for "Because you liked '…'" section (e.g. from user's likes); can be wired to real data later */
const LIKED_PACK_NAME = 'Sample Pack Name';

const SIMILAR_PACKS_TO_LIKES = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '30', genre: 'Hip-Hop' },
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

function SubscribedTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  return (
    <div className="border-b border-[#e8e2d2] flex gap-4 items-center w-full mb-8">
      {SUBSCRIBED_TABS.map((tab) => {
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
      {/* discovered samples and creators */}
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
      <SimilarSamplesSection />

      {/* Similar packs to your likes – same carousel as Featured Packs (Figma 789-41477) */}
      <CardCarousel
        title={`Because you liked "${LIKED_PACK_NAME}"`}
        subtitle="Updated daily"
      >
        {SIMILAR_PACKS_TO_LIKES.map((pack) => (
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

      {/* featured packs */}
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

function LibraryTabContent() {
  return (
    <div className="mb-8 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[#e8e2d2] bg-white/60 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#161410]/10 p-3">
              <Download className="size-6 text-[#161410]" />
            </div>
            <h3 className="font-semibold text-[#161410]">Downloads</h3>
          </div>
          <p className="text-sm text-[#7f7766]">Samples and packs you’ve downloaded. Access them anytime.</p>
          <Link to="#" className="text-sm font-medium text-[#161410] hover:underline mt-auto">View downloads →</Link>
        </div>
        <div className="rounded-xl border border-[#e8e2d2] bg-white/60 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#161410]/10 p-3">
              <Music2 className="size-6 text-[#161410]" />
            </div>
            <h3 className="font-semibold text-[#161410]">Recent plays</h3>
          </div>
          <p className="text-sm text-[#7f7766]">Continue where you left off. Your recently played content.</p>
          <Link to="#" className="text-sm font-medium text-[#161410] hover:underline mt-auto">View recent →</Link>
        </div>
        <div className="rounded-xl border border-[#e8e2d2] bg-white/60 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#161410]/10 p-3">
              <Library className="size-6 text-[#161410]" />
            </div>
            <h3 className="font-semibold text-[#161410]">Saved</h3>
          </div>
          <p className="text-sm text-[#7f7766]">Favorites and saved packs. Build your personal collection.</p>
          <Link to="#" className="text-sm font-medium text-[#161410] hover:underline mt-auto">View saved →</Link>
        </div>
      </div>
      <CardCarousel title="Recently added to your library" ctaLabel="View all">
        {FEATURED_PACKS.slice(0, 4).map((pack) => (
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
    </div>
  );
}

export default function SubscribedDashboardPage() {
  const { isTrialing } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>(SUBSCRIBED_TABS[0].id);
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
                You’re on a free trial. Subscribe to keep access after it ends.
              </p>
            )}
          </div>
          <p className="text-[#e8e2d2] text-sm">
            Credits: <span className="font-semibold text-white">{credits ?? '—'}</span>
          </p>
        </div>

        <SubscribedTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="max-w-6xl mx-auto">
          {activeTab === 'discover' && <DiscoverTabContent />}
          {activeTab === 'library' && <LibraryTabContent />}
          {activeTab === 'packs' && <DiscoverTabContent />}
          {activeTab === 'samples' && <DiscoverTabContent />}
          {activeTab === 'creators' && <DiscoverTabContent />}
          {activeTab === 'genres' && <DiscoverTabContent />}
        </div>
      </div>
    </div>
  );
}
