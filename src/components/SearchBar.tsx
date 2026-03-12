/**
 * Navbar search bar with focus-triggered suggestion panel (Figma 821-67686).
 * Shows Recent searches, Popular searches, and Top genres as clickable tags.
 */
import { useRef, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchBarSuggestions {
  recentSearches?: string[];
  popularSearches?: string[];
  topGenres?: string[];
}

const DEFAULT_SUGGESTIONS: Required<SearchBarSuggestions> = {
  recentSearches: ['Vocals', 'Drake', 'Hi-Hop', 'Trap', 'Lil Baby'],
  popularSearches: ['Vocals', 'Snare', 'Bass', 'Clap', '808'],
  topGenres: ['Hip-Hop', 'Trap', 'RnB', 'Drums', 'Soul'],
};

/** Section identifier so the parent can set URL params (e.g. tab=genres for Top genres). */
export type SearchSuggestionSection = 'recent' | 'popular' | 'genres';

export interface SearchBarProps {
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  suggestions?: SearchBarSuggestions;
  onSearch?: (query: string) => void;
  /** term and optional section (e.g. "genres" for Top genres). */
  onSuggestionSelect?: (term: string, section?: SearchSuggestionSection) => void;
}

function SuggestionSection({
  title,
  tags,
  section,
  onSelect,
}: {
  title: string;
  tags: string[];
  section?: SearchSuggestionSection;
  onSelect: (term: string, section?: SearchSuggestionSection) => void;
}) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      <p className="font-semibold text-sm text-[#161410] tracking-[0.1px] w-full">
        {title}
      </p>
      <div className="flex flex-wrap gap-2 items-center w-full">
        {tags.map((label) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(label, section);
            }}
            className={cn(
              'h-5 px-1.5 rounded-md border border-[#e8e2d2] bg-[#f6f2e6]',
              'text-[10px] font-medium text-[#161410] tracking-[0.3px] whitespace-nowrap',
              'hover:bg-[#e8e2d2] transition-colors cursor-pointer'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SearchBar({
  placeholder = 'Search packs, samples, and creators',
  ariaLabel = 'Search packs, samples, and creators',
  className,
  suggestions: customSuggestions,
  onSearch,
  onSuggestionSelect,
}: SearchBarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions: Required<SearchBarSuggestions> = {
    ...DEFAULT_SUGGESTIONS,
    ...customSuggestions,
  };

  const handleFocus = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Delay so mousedown on a suggestion can fire before we close
    window.setTimeout(() => setIsPanelOpen(false), 150);
  }, []);

  const handleSelect = useCallback(
    (term: string, section?: SearchSuggestionSection) => {
      onSuggestionSelect?.(term, section);
      // Do not call onSearch here: it would navigate again without tab and overwrite onSuggestionSelect's URL.
      setIsPanelOpen(false);
    },
    [onSuggestionSelect]
  );

  return (
    <div ref={containerRef} className={cn('relative w-[360px] max-w-[360px]', className)}>
      <div
        className={cn(
          'border border-[#d6ceb8] flex h-10 items-center overflow-hidden rounded-[2px]',
          'bg-transparent px-3',
          isPanelOpen && 'border-b-transparent rounded-b-none'
        )}
      >
        <Search className="size-5 shrink-0 text-[#7f7766] mr-2" aria-hidden />
        <Input
          type="search"
          placeholder={placeholder}
          aria-label={ariaLabel}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch?.((e.target as HTMLInputElement).value);
          }}
          className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
        />
      </div>

      {isPanelOpen && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-0 rounded-b-[4px] border border-[#d6ceb8] border-t-0 bg-white p-6 shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.08)]"
          onMouseDown={(e) => e.preventDefault()}
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="flex flex-col gap-6 items-start">
            <SuggestionSection
              title="Recent searches"
              tags={suggestions.recentSearches}
              section="recent"
              onSelect={handleSelect}
            />
            <SuggestionSection
              title="Popular searches"
              tags={suggestions.popularSearches}
              section="popular"
              onSelect={handleSelect}
            />
            <SuggestionSection
              title="Top genres"
              tags={suggestions.topGenres}
              section="genres"
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
