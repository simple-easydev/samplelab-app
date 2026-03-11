import { useState, useEffect } from 'react';
import { PacksFilterBar } from './PacksFilterBar';
import { PacksFilterBarMobile } from './PacksFilterBarMobile';
import { PacksFilterProvider } from '@/contexts/PacksFilterContext';
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
    <PacksFilterProvider>
      {/* Mobile: full-screen filters modal + search */}
      <div className="md:hidden w-full">
        <PacksFilterBarMobile />
      </div>
      {/* Desktop: dropdown filter bar + search */}
      <div className="hidden md:block w-full">
        <PacksFilterBar />
      </div>
      {/* Grid of sample pack cards – Figma 756-50536 */}
      <section className="w-full" aria-label="Sample packs">
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(209px,1fr))]">
          {loading ? (
            <p className="text-[#5e584b] text-sm">Loading packs…</p>
          ) : (
            packs.map((pack) => (
              <SamplePackCard
                key={pack.id}
                pack={{
                  id: pack.id,
                  name: pack.name,
                  creator_name: pack.creator_name,
                  cover_url: pack.cover_url,
                  samples_count: pack.samples_count ?? pack.samples_count,
                  category_name: pack.genres?.[0] ?? pack.category_name ?? undefined,
                  is_premium: pack.is_premium ?? false,
                }}
              />
            ))
          )}
        </div>
      </section>
    </PacksFilterProvider>
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
