/**
 * Shared tab content for both subscribed and un-subscribed dashboard.
 * Import DiscoverTabContent, PacksTabContent, etc. and DASHBOARD_TABS.
 */
import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverListColumn } from '@/components/DiscoverListColumn';
import { SimilarSamplesSection } from '@/components/SimilarSamplesSection';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';

export const DASHBOARD_TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

export const TRENDING_ITEMS = [
  { rank: 1, name: 'Sample name goes here', creator: 'Creator name' },
  { rank: 2, name: 'Lo-Fi Keys Loop', creator: 'Beat Lab' },
  { rank: 3, name: 'Trap Hi-Hat Sequence', creator: 'Sound Factory' },
  { rank: 4, name: 'Soul Chop 04', creator: 'Vinyl Revival' },
  { rank: 5, name: 'Synth Pad Texture', creator: 'Synth Wave' },
];

export const NEW_RELEASES_ITEMS = [
  { rank: 1, name: 'Fresh Drop Vol. 1', creator: 'Beat Lab' },
  { rank: 2, name: 'Weekend Pack', creator: 'Sound Factory' },
  { rank: 3, name: 'Midnight Loops', creator: 'Vinyl Revival' },
  { rank: 4, name: '808 Essentials', creator: 'Synth Wave' },
  { rank: 5, name: 'Chill Vibes Pack', creator: 'Creator name' },
];

export const CREATORS_ITEMS = [
  { rank: 1, name: 'Beat Lab', creator: '24 packs' },
  { rank: 2, name: 'Sound Factory', creator: '18 packs' },
  { rank: 3, name: 'Vinyl Revival', creator: '31 packs' },
  { rank: 4, name: 'Synth Wave', creator: '12 packs' },
  { rank: 5, name: 'Creator name', creator: '8 packs' },
];

export const FEATURED_PACKS = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '20', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
];

const LIKED_PACK_NAME = 'Sample Pack Name';

export const SIMILAR_PACKS_TO_LIKES = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '30', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
];

export const FEATURED_CREATORS = [
  { name: 'Creator Name Goes Here', followersCount: '100', packsCount: '10' },
  { name: 'Beat Lab', followersCount: '250', packsCount: '24' },
  { name: 'Sound Factory', followersCount: '180', packsCount: '18' },
  { name: 'Vinyl Revival', followersCount: '320', packsCount: '31' },
  { name: 'Synth Wave', followersCount: '95', packsCount: '12' },
  { name: 'Creator name', followersCount: '64', packsCount: '8' },
];

export const TOP_GENRES = [
  { name: 'Hip-Hop' },
  { name: 'Drums' },
  { name: 'Boom Bap' },
  { name: 'Lo-Fi' },
  { name: 'Trap' },
  { name: 'Drill' },
  { name: 'Soul' },
];

export interface DiscoverTabContentProps {
  /** When 'subscribed', shows SimilarSamplesSection and "Because you liked" section */
  variant?: 'default' | 'subscribed';
}

export function DiscoverTabContent({ variant = 'default' }: DiscoverTabContentProps) {
  const isSubscribed = variant === 'subscribed';

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
      {isSubscribed && <SimilarSamplesSection />}
      {isSubscribed && (
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
      )}
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

export function PacksTabContent() {
  return <div className="mb-8" />;
}

export function SamplesTabContent() {
  return <div className="mb-8" />;
}

export function CreatorsTabContent() {
  return <div className="mb-8" />;
}

export function GenresTabContent() {
  return <div className="mb-8" />;
}
