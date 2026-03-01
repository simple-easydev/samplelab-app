import { ArrowRight } from 'lucide-react';

/**
 * Reusable list column from Figma (node 812-51974) – same list view for Trending samples, New Releases, Creators.
 */
export interface DiscoverListItem {
  rank: number;
  name: string;
  creator: string;
}

interface DiscoverListColumnProps {
  title: string;
  subtitle: string;
  items: DiscoverListItem[];
  ctaLabel: string;
}

export function DiscoverListColumn({ title, subtitle, items, ctaLabel }: DiscoverListColumnProps) {
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
        {items.map((item) => (
          <div
            key={`${item.rank}-${item.name}`}
            className="bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex gap-4 items-center p-4 w-full"
          >
            <span className="text-[#161410] text-base font-medium leading-6 text-center w-4 shrink-0">
              {item.rank}
            </span>
            <div className="flex gap-4 items-center min-w-0 flex-1">
              <div className="bg-white rounded-[2px] size-14 shrink-0 overflow-hidden">
                <div className="size-full bg-[#e8e2d2]" aria-hidden />
              </div>
              <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
                <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
                  {item.name}
                </p>
                <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
                  {item.creator}
                </p>
              </div>
            </div>
          </div>
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
