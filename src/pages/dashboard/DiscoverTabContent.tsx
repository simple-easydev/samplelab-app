import { Link } from 'react-router-dom';
import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverCarouselMobile } from '@/components/DiscoverCarouselMobile';
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
  genreNameToSlug,
} from './constants';

export interface DiscoverTabContentProps {
  /** When 'subscribed', shows SimilarSamplesSection and "Because you liked" section */
  variant?: 'default' | 'subscribed';
}

export function DiscoverTabContent({ variant = 'default' }: DiscoverTabContentProps) {
  const isSubscribed = variant === 'subscribed';

  return (
    <div className="mb-8 flex flex-col gap-8">
      <DiscoverCarouselMobile />
      <div className="hidden md:block">
        <DiscoverCarousel />
      </div>
      <div className="w-screen relative left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0 flex gap-6 items-start overflow-x-auto md:overflow-visible pb-2 px-4 md:px-0">
        <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
          <DiscoverListColumn
            title="Trending samples"
            subtitle="The most downloaded samples right now"
            items={TRENDING_ITEMS}
            ctaLabel="View all Trending samples"
          />
        </div>
        <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
          <DiscoverListColumn
            title="New releases"
            subtitle="Fresh samples added this week"
            items={NEW_RELEASES_ITEMS}
            ctaLabel="View new releases"
          />
        </div>
        <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
          <DiscoverListColumn
            title="Top creators"
            subtitle="Most downloaded creators this month"
            items={CREATORS_ITEMS}
            ctaLabel="View all creators"
          />
        </div>
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
            lockDesktop
          />
        ))}
      </CardCarousel>
      <CardCarousel title="Featured creators" ctaLabel="View all creators">
        {FEATURED_CREATORS.map((creator) => (
          <CreatorCard
            key={creator.name}
            name={creator.name}
            samplesCount={creator.samplesCount}
            packsCount={creator.packsCount}
            lockDesktop
          />
        ))}
      </CardCarousel>
      <CardCarousel title="Top genres" ctaLabel="View all genres">
        {TOP_GENRES.map((genre) => (
          <Link
            key={genre.name}
            to={`/dashboard/genres/${genreNameToSlug(genre.name)}`}
            className="contents"
          >
            <GenreCard name={genre.name} lockDesktop />
          </Link>
        ))}
      </CardCarousel>
    </div>
  );
}
