import { PacksFilterBar } from './PacksFilterBar';
import { SamplePackCard } from '@/components/SamplePackCard';
import { PACKS_GRID_ITEMS } from './constants';

export function PacksTabContent() {
  return (
    <div className="mb-8 flex flex-col gap-8">
      <PacksFilterBar />
      {/* Grid of 18 sample pack cards – Figma 756-50536 */}
      <section className="w-full" aria-label="Sample packs">
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(209px,1fr))]">
          {PACKS_GRID_ITEMS.map((pack) => (
            <SamplePackCard
              key={`${pack.title}-${pack.creator}`}
              title={pack.title}
              creator={pack.creator}
              playCount={pack.playCount}
              genre={pack.genre}
              premium={pack.premium}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
