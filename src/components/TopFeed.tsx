import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SampleRow } from '@/components/SampleRow';
import { getHomeFeed } from '@/lib/supabase/homeFeed';
import type { CreatorWithCounts } from '@/lib/supabase/creators';
import { SampleItem } from '@/lib/supabase/samples';
import { mapAllSampleToRowItem } from '@/lib/utils';



function DiscoveredSamplesColumn({
  title,
  subtitle,
  items,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  items: SampleItem[];
  ctaLabel: string;
}) {

  const sampleItems = items.map(mapAllSampleToRowItem);
  
  return (
    <div className="flex flex-col gap-6 flex-1 min-w-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">{title}</h2>
        <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">{subtitle}</p>
      </div>
      <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
        {sampleItems.map((item, index) => (
          <SampleRow key={item.id} item={item} variant="compact" rank={index + 1} />
        ))}
        <div className="bg-[#f6f2e6] border-t-0 border-[#e8e2d2] flex items-center justify-center min-h-14 px-4 w-full">
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

function TopCreatorsColumn({
  title,
  subtitle,
  creators,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  creators: CreatorWithCounts[];
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6 flex-1 min-w-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">{title}</h2>
        <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">{subtitle}</p>
      </div>
      <div className="border border-[#E8E2D2] rounded overflow-hidden flex flex-col">
        {creators.map((c, i) => {
          const rank = i + 1;
          const row = (
            <div className="flex gap-4 items-center w-full bg-[#f6f2e6] border-b border-[#e8e2d2] p-4">
              <p className="shrink-0 w-4 text-center text-[#161410] text-base font-medium leading-6 tabular-nums">
                {rank}
              </p>
              <div className="flex flex-1 gap-4 items-center min-w-0">
                <div className="shrink-0 size-14 rounded-full overflow-hidden bg-white border border-[#e8e2d2]">
                  {c.avatar_url ? (
                    <img
                      src={c.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e8e2d2]" aria-hidden />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <p className="font-bold text-sm text-[#161410] leading-5 tracking-[0.1px] truncate">
                    {c.name}
                  </p>
                  <div className="flex gap-2 items-center text-xs text-[#5e584b] tracking-[0.2px]">
                    <span>{c.samples_count} Samples</span>
                    <span className="size-1 rounded-full bg-[#5e584b] shrink-0" aria-hidden />
                    <span>{c.packs_count} Packs</span>
                  </div>
                </div>
              </div>
            </div>
          );
          return c.id ? (
            <Link
              key={c.id}
              to={`/dashboard/creators/${c.id}`}
              className="block first:rounded-t-[3px] last:rounded-b-[3px] hover:bg-[#efece4]"
            >
              {row}
            </Link>
          ) : (
            <div key={c.name}>{row}</div>
          );
        })}
        <div className="bg-[#f6f2e6] border-t-0 border-[#e8e2d2] flex items-center justify-center min-h-14 px-4 w-full">
          <Link
            to="/dashboard/creators"
            className="inline-flex items-center gap-[6px] text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:underline underline-offset-2"
          >
            {ctaLabel}
            <ArrowRight className="size-5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}



export function TopFeed() {
  const [trendingItems, setTrendingItems] = useState<SampleItem[]>([]);
  const [newReleasesItems, setNewReleasesItems] = useState<SampleItem[]>([]);
  const [creatorsItems, setCreatorsItems] = useState<CreatorWithCounts[]>([]);

  useEffect(() => {
    getHomeFeed().then((feed) => {
      if (!feed) return;
      
      if (feed.trending_samples.length) setTrendingItems(feed.trending_samples);
      if (feed.new_releases.length) setNewReleasesItems(feed.new_releases);
      if (feed.top_creators.length) setCreatorsItems(feed.top_creators);
    });
  }, []);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0 flex gap-6 items-start overflow-x-auto md:overflow-visible pb-2 px-4 md:px-0">
      <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
        <DiscoveredSamplesColumn
          title="Trending samples"
          subtitle="The most downloaded samples right now"
          items={trendingItems}
          ctaLabel="View all Trending samples"
        />
      </div>
      <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
        <DiscoveredSamplesColumn
          title="New releases"
          subtitle="Fresh samples added this week"
          items={newReleasesItems}
          ctaLabel="View new releases"
        />
      </div>
      <div className="shrink-0 w-[340px] min-w-[340px] md:w-auto md:min-w-0 md:flex-1">
        <TopCreatorsColumn
          title="Top creators"
          subtitle="Most downloaded creators this month"
          creators={creatorsItems}
          ctaLabel="View all creators"
        />
      </div>
    </div>
  );
}
