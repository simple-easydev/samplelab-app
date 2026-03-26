import { DiscoverCarousel } from '@/components/DiscoverCarousel';
import { DiscoverCarouselMobile } from '@/components/DiscoverCarouselMobile';
import { TopFeed } from '@/components/TopFeed';
import { SimilarSamplesSection } from '@/components/SimilarSamplesSection';
import { SimilarPacksByLikedSection } from '@/components/SimilarPacksByLikedSection';
import { FeaturedPackSection } from '@/components/FeaturedPackSection';
import { FeaturedCreatorsSection } from '@/components/FeaturedCreatorsSection';
import { TopGenresSection } from '@/components/TopGenresSection';

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
      {isSubscribed && <SimilarPacksByLikedSection />}
      <FeaturedPackSection />
      <FeaturedCreatorsSection />
      <TopGenresSection />
    </div>
  );
}
