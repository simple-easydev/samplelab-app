import { useEffect, useState } from 'react';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { getFeaturedPacks, type FeaturedPackRow } from '@/lib/supabase/packs';

export interface FeaturedPackSectionProps {
  /** Optional initial/fallback packs while loading or on error. */
  fallbackPacks?: FeaturedPackRow[];
}

export function FeaturedPackSection({ fallbackPacks = [] }: FeaturedPackSectionProps) {
  const [packs, setPacks] = useState<FeaturedPackRow[]>(fallbackPacks);

  useEffect(() => {
    getFeaturedPacks().then((rows) => {
      if (rows.length > 0) {
        setPacks(rows);
      }
    });
  }, []);

  return (
    <CardCarousel title="Featured Packs" ctaLabel="View all packs">
      {packs.map((pack) => (
        <SamplePackCard key={pack.id} pack={pack} lockDesktop />
      ))}
    </CardCarousel>
  );
}
