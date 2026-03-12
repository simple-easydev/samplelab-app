import { PacksFilterBar } from './PacksFilterBar';
import { PacksFilterBarMobile } from './PacksFilterBarMobile';
import { PacksFilterProvider, usePacksFilterBar } from '@/contexts/PacksFilterContext';
import { SamplePackCard } from '@/components/SamplePackCard';
import { AccessGate } from '@/components/AccessGate';
import { useSubscription } from '@/hooks/useSubscription';

/** Grid of pack cards; reads packs + loading from PacksFilterContext. */
function PacksGrid() {
  const { packs, loading } = usePacksFilterBar();

  return (
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
  );
}

export function PacksTabContent() {
  const { isActive } = useSubscription();
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
      <PacksGrid />
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
