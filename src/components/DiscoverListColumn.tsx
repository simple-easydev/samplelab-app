import { ArrowRight } from 'lucide-react';
import { SampleRow } from '@/components/SampleRow';
import type { SampleRowItem } from '@/components/SampleRow';

/**
 * Reusable list column from Figma (node 812-51974) – same list view for Trending samples, New Releases, Creators.
 * Uses SampleRow in compact variant (rank + thumbnail + name + creator only).
 */
export interface DiscoverListItem {
  rank: number;
  name: string;
  creator: string;
}

function discoverItemToSimilarSample(item: DiscoverListItem): SampleRowItem {
  return {
    id: `discover-${item.rank}-${item.name}`,
    name: item.name,
    creator: item.creator,
    duration: '0:00',
    tags: [],
  };
}

interface DiscoverListColumnProps {
  title: string;
  subtitle: string;
  items: DiscoverListItem[];
  ctaLabel: string;
}

export function DiscoverListColumn({ title, subtitle, items, ctaLabel }: DiscoverListColumnProps) {
  const sampleItems = items.map((item) => ({
    ...discoverItemToSimilarSample(item),
    rank: item.rank,
  }));

  return (
    <div className="flex flex-col gap-6 flex-1 min-w-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
          {title}
        </h2>
        <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
          {subtitle}
        </p>
      </div>

      <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
        {sampleItems.map(({ rank, ...item }) => (
          <SampleRow
            key={item.id}
            item={item}
            variant="compact"
            rank={rank}
          />
        ))}
        <div className="bg-[#f6f2e6] border-t border-[#e8e2d2] flex items-center justify-center min-h-14 px-4 w-full">
          <a
            href="#"
            className="inline-flex items-center gap-[6px] text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:underline underline-offset-2"
          >
            {ctaLabel}
            <ArrowRight className="size-5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
