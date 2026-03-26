import { useEffect, useState } from 'react';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import {
  getSimilarPacksByLikedPack,
  type PackRow,
} from '@/lib/supabase/packs';

/**
 * Discover tab — "Because you liked …" horizontal pack carousel (subscribed users).
 * Data from RPC get_similar_packs_by_liked_pack.
 */
export function SimilarPacksByLikedSection() {
  const [likedPackName, setLikedPackName] = useState<string | null>(null);
  const [packs, setPacks] = useState<PackRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const result = await getSimilarPacksByLikedPack({ p_limit: 6 });
        if (cancelled) return;
        if (result) {
          setLikedPackName(result.liked_pack?.name?.trim() ?? null);
          setPacks(result.similarities);
        } else {
          setLikedPackName(null);
          setPacks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || packs.length === 0) return null;

  const titleName = likedPackName?.length ? likedPackName : 'a pack you saved';

  return (
    <CardCarousel title={`Because you liked "${titleName}"`} subtitle="Updated daily">
      {packs.map((pack) => (
        <SamplePackCard
          key={pack.id}
          pack={{
            id: pack.id,
            name: pack.name,
            creator_name: pack.creator_name,
            cover_url: pack.cover_url,
            download_count: pack.download_count,
            samples_count: pack.samples_count,
            category_name: pack.category_name,
            is_premium: pack.is_premium,
          }}
        />
      ))}
    </CardCarousel>
  );
}
