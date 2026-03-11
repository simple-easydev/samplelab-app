import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverCarouselMobile } from '@/components/DiscoverCarouselMobile';
import { TopFeed } from '@/components/TopFeed';
import { SimilarSamplesSection } from '@/components/SimilarSamplesSection';
import { CardCarousel } from '@/components/CardCarousel';
import { FeaturedPackSection } from '@/components/FeaturedPackSection';
import { FeaturedCreatorsSection } from '@/components/FeaturedCreatorsSection';
import { TopGenresSection } from '@/components/TopGenresSection';
import { SamplePackCard } from '@/components/SamplePackCard';
import { SIMILAR_PACKS_TO_LIKES, LIKED_PACK_NAME } from './constants';

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
      <TopFeed />
      {isSubscribed && <SimilarSamplesSection />}
      {isSubscribed && (
        <CardCarousel
          title={`Because you liked "${LIKED_PACK_NAME}"`}
          subtitle="Updated daily"
        >
          {SIMILAR_PACKS_TO_LIKES.map((pack) => (
            <SamplePackCard
              key={pack.id}
              pack={{
                id: pack.id,
                name: pack.title,
                creator_name: pack.creator,
                download_count: pack.playCount ? parseInt(pack.playCount, 10) : undefined,
                category_name: pack.genre ?? undefined,
                is_premium: pack.premium ?? false,
              }}
            />
          ))}
        </CardCarousel>
      )}
      <FeaturedPackSection />
      <FeaturedCreatorsSection />
      <TopGenresSection />
    </div>
  );
}
