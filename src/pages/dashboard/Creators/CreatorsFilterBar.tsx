/**
 * Creators filter bar – Figma 812-85009 / 1465-144599 (mobile).
 * Sort options (Trending, Popular, Recent, A-Z) and search.
 * Mobile: stacked layout with gap-y-4 (16px), full-width search.
 * When URL has ?q=..., shows SearchQueryChip instead of the search input.
 */
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchQueryChip } from '@/components/SearchQueryChip';
import { CREATORS_SORT_OPTIONS } from '../constants';

export interface CreatorsFilterBarProps {
  sortId: string;
  onSortIdChange: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  /** When set, show SearchQueryChip instead of search input */
  qFromUrl: string;
  onClearSearch: () => void;
  resultCount: number;
}

export function CreatorsFilterBar({
  sortId,
  onSortIdChange,
  searchQuery,
  onSearchQueryChange,
  qFromUrl,
  onClearSearch,
  resultCount,
}: CreatorsFilterBarProps) {
  return (
    <div className="flex flex-col gap-y-4 w-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <div className="flex gap-2 items-center flex-wrap">
        {CREATORS_SORT_OPTIONS.map((option) => {
          const isSelected = sortId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSortIdChange(option.id)}
              className={`flex h-10 items-center justify-center gap-1.5 px-3 rounded-xs border shrink-0 font-medium text-sm leading-5 tracking-[0.1px] whitespace-nowrap transition-colors ${
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
          resultCount={resultCount}
          onClear={onClearSearch}
        />
      ) : (
        <div className="border border-[#d6ceb8] flex h-10 items-center gap-2 px-3 rounded-xs w-full min-w-0 bg-transparent sm:w-[250px] sm:shrink-0">
          <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search creators"
            className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
            aria-label="Search creators"
          />
        </div>
      )}
    </div>
  );
}
