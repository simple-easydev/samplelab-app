import { useState, useEffect } from 'react';
import { PacksFilterBar } from './PacksFilterBar';
import { SamplePackCard } from '@/components/SamplePackCard';
import { AccessGate } from '@/components/AccessGate';
import { useSubscription } from '@/hooks/useSubscription';
import { getAllPacks } from '@/lib/supabase/packs';

export function PacksTabContent() {
  const { isActive } = useSubscription();
  const [packs, setPacks] = useState<Awaited<ReturnType<typeof getAllPacks>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getAllPacks()
      .then((data) => {
        if (!cancelled) {
          setPacks(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const content = (
    <>
      <PacksFilterBar />
      {/* Grid of sample pack cards – Figma 756-50536 */}
      <section className="w-full" aria-label="Sample packs">
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(209px,1fr))]">
          {loading ? (
            <p className="text-[#5e584b] text-sm">Loading packs…</p>
          ) : (
            packs.map((pack) => (
              <SamplePackCard
                key={pack.id}
                packId={pack.id}
                title={pack.name}
                creator={pack.creator_name}
                playCount={String(pack.samples_count)}
                genre={pack.genres?.[0] ?? pack.category_name ?? undefined}
                premium={pack.is_premium ?? false}
                imageUrl={pack.cover_url ?? undefined}
              />
            ))
          )}
        </div>
      </section>
    </>
  );

  if (isActive) {
    return <div className="mb-8 flex flex-col gap-8">{content}</div>;
  }

  return (
    <div className="relative mb-8 max-h-[calc(100vh-14rem)] overflow-hidden">
      <div className="flex flex-col gap-8 pb-24">
        {content}
      </div>
      <AccessGate />
    </div>
  );
}
