/**
 * Creators tab – Figma 812-85001.
 * Filter bar (Trending, Popular, Recent, A-Z), search, and grid of CreatorCards.
 * When URL has ?q=..., shows SearchQueryChip instead of the search input.
 */
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AccessGate } from '@/components/AccessGate';
import { CreatorCard } from '@/components/CreatorCard';
import { Input } from '@/components/ui/input';
import { SearchQueryChip } from '@/components/SearchQueryChip';
import { useSubscription } from '@/hooks/useSubscription';
import { CREATORS_SORT_OPTIONS, CREATORS_GRID_ITEMS, creatorNameToSlug } from './constants';

export function CreatorsTabContent() {
  const { isActive } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [sortId, setSortId] = useState<string>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCreators = useMemo(() => {
    const raw = qFromUrl.trim() || searchQuery.trim();
    const q = raw.toLowerCase();
    const list = q
      ? CREATORS_GRID_ITEMS.filter((c) => c.name.toLowerCase().includes(q))
      : CREATORS_GRID_ITEMS;
    if (sortId === 'a-z') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [qFromUrl, searchQuery, sortId]);

  return (
    <div className="mb-8 flex flex-col gap-8 relative">
      {!isActive && <AccessGate />}

      <div className="flex flex-col gap-8">
        {/* Filters + search – Figma 812-85009 */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 items-center">
            {CREATORS_SORT_OPTIONS.map((option) => {
              const isSelected = sortId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortId(option.id)}
                  className={`flex h-10 items-center justify-center px-3 rounded-xs border shrink-0 font-medium text-sm leading-5 tracking-[0.1px] whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                      : 'border-[#d6ceb8] text-[#5e584b] bg-transparent hover:border-[#161410] hover:text-[#161410]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {qFromUrl.trim() ? (
            <SearchQueryChip
              query={qFromUrl}
              resultCount={filteredCreators.length}
              onClear={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete('q');
                  return next;
                });
              }}
            />
          ) : (
            <div className="border border-[#d6ceb8] flex h-10 items-center gap-2 px-3 rounded-xs w-[250px] shrink-0 bg-transparent">
              <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators"
                className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
                aria-label="Search creators"
              />
            </div>
          )}
        </div>

        {/* Creator cards grid – Figma 821-34268, gap 24px */}
        <div className="flex flex-wrap gap-6 items-center content-center w-full">
          {filteredCreators.map((creator, index) => (
            <CreatorCard
              key={`${creator.name}-${index}`}
              name={creator.name}
              followersCount={creator.followersCount}
              packsCount={creator.packsCount}
              creatorSlug={creatorNameToSlug(creator.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
