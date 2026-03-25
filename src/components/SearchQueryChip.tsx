/**
 * "X results for" + removable query chip (Figma search result bar).
 * Shown in tab content when URL has ?q=...; replaces the search input.
 */
import { X } from 'lucide-react';

export interface SearchQueryChipProps {
  /** Search query to display in the chip */
  query: string;
  /** Optional result count; when provided shows "N results for" */
  resultCount?: number;
  /** When true with resultCount, shows "N+ results for" (more can load, e.g. infinite scroll). */
  resultCountHasMore?: boolean;
  /** Called when the user clicks the chip X to clear the search */
  onClear: () => void;
}

export function SearchQueryChip({
  query,
  resultCount,
  resultCountHasMore,
  onClear,
}: SearchQueryChipProps) {
  const countLabel =
    resultCount != null
      ? `${resultCount}${resultCountHasMore ? '+' : ''} results for`
      : 'Results for';
  return (
    <div className="flex gap-3 h-10 items-center">
      <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
        {countLabel}
      </span>
      <button
        type="button"
        onClick={onClear}
        className="bg-[#161410] text-[#fffbf0] h-10 px-3 rounded-full inline-flex items-center gap-2 text-sm font-medium tracking-[0.1px] hover:opacity-90 transition-opacity"
        aria-label={`Clear search "${query}"`}
      >
        <span>{query || 'Search'}</span>
        <X className="size-5 shrink-0" />
      </button>
    </div>
  );
}
