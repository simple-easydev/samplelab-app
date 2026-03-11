import { useEffect, useState } from 'react';
import { CardCarousel } from '@/components/CardCarousel';
import { CreatorCard } from '@/components/CreatorCard';
import { getFeaturedCreators, type CreatorWithCounts } from '@/lib/supabase/creators';

export interface FeaturedCreatorsSectionProps {
  /** Optional initial/fallback creators while loading or on error. */
  fallbackCreators?: CreatorWithCounts[];
}

export function FeaturedCreatorsSection({ fallbackCreators = [] }: FeaturedCreatorsSectionProps) {
  const [creators, setCreators] = useState<CreatorWithCounts[]>(fallbackCreators);

  useEffect(() => {
    getFeaturedCreators().then((rows) => {
      if (rows.length > 0) {
        setCreators(rows);
      }
    });
  }, []);

  return (
    <CardCarousel title="Featured creators" ctaLabel="View all creators">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creatorId={creator.id}
          name={creator.name}
          samplesCount={String(creator.samples_count)}
          packsCount={String(creator.packs_count)}
          imageUrl={creator.avatar_url ?? undefined}
          lockDesktop
        />
      ))}
    </CardCarousel>
  );
}
