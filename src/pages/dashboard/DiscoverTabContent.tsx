import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverListColumn } from '@/components/DiscoverListColumn';
import { SimilarSamplesSection } from '@/components/SimilarSamplesSection';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';
import {
  TRENDING_ITEMS,
  NEW_RELEASES_ITEMS,
  CREATORS_ITEMS,
  FEATURED_PACKS,
  SIMILAR_PACKS_TO_LIKES,
  LIKED_PACK_NAME,
  FEATURED_CREATORS,
  TOP_GENRES,
  creatorNameToSlug,
} from './constants';

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
              key={pack.id}
              packId={pack.id}
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
            key={pack.id}
            packId={pack.id}
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
            creatorSlug={creatorNameToSlug(creator.name)}
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
