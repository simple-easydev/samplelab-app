/**
 * Mobile Packs filter bar — Figma 1396-167722.
 * Filter button + search; sort and filters in accordion-style full-screen modal.
 */
import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchQueryChip } from '@/components/SearchQueryChip';
import { usePacksFilterBar } from '@/contexts/PacksFilterContext';
import {
  TOP_GENRES,
  KEYWORDS_OPTIONS,
  ACCESS_OPTIONS,
  LICENSE_OPTIONS,
  CREATOR_FILTER_OPTIONS,
  RELEASED_OPTIONS,
} from '../constants';

/** Sort options for mobile — Figma 1396-167722 (Trending, Popular, Recent, Random, A-Z). */
const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Recent' },
  { id: 'random', label: 'Random' },
  { id: 'name-az', label: 'A-Z' },
] as const;

export type PacksFilterBarMobileSortId =
  | (typeof SORT_OPTIONS)[number]['id']
  | 'oldest'
  | 'name-za';
export type PacksFilterBarMobileAccessId = (typeof ACCESS_OPTIONS)[number]['id'];
export type PacksFilterBarMobileLicenseId = (typeof LICENSE_OPTIONS)[number]['id'];
export type PacksFilterBarMobileReleasedId = (typeof RELEASED_OPTIONS)[number]['id'];

export interface PacksFilterBarMobileProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortId: PacksFilterBarMobileSortId;
  onSortIdChange: (id: PacksFilterBarMobileSortId) => void;
  selectedGenres: Set<string>;
  onToggleGenre: (genre: string) => void;
  genreSearch: string;
  onGenreSearchChange: (value: string) => void;
  selectedKeywords: Set<string>;
  onToggleKeyword: (keyword: string) => void;
  keywordSearch: string;
  onKeywordSearchChange: (value: string) => void;
  accessId: PacksFilterBarMobileAccessId;
  onAccessIdChange: (id: PacksFilterBarMobileAccessId) => void;
  licenseId: PacksFilterBarMobileLicenseId;
  onLicenseIdChange: (id: PacksFilterBarMobileLicenseId) => void;
  selectedCreators: Set<string>;
  onToggleCreator: (creator: string) => void;
  creatorSearch: string;
  onCreatorSearchChange: (value: string) => void;
  releasedId: PacksFilterBarMobileReleasedId;
  onReleasedIdChange: (id: PacksFilterBarMobileReleasedId) => void;
  onClearAllFilters: () => void;
  /** When true, show search query chip instead of input (e.g. from URL). */
  showSearchChip?: boolean;
  /** Search query text to show in the chip (e.g. from URL). */
  searchChipQuery?: string;
  onClearSearchQuery?: () => void;
  searchResultCount?: number;
}

type AccordionSection = 'sort' | 'genre' | 'keywords' | 'access' | 'license' | 'creator' | 'released';

/** Section row: 56px height, overline label + chevron — Figma 1396-167722 */
function AccordionRow({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e8e2d2] bg-[#fffbf0]">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-14 w-full items-center gap-3 px-4 text-left"
        aria-expanded={expanded}
      >
        <span className="min-w-0 flex-1 text-sm font-medium uppercase tracking-[0.9px] text-[#161410]">
          {label}
        </span>
        <span className="shrink-0 text-[#161410]" aria-hidden>
          {expanded ? (
            <ChevronUp className="size-6" />
          ) : (
            <ChevronDown className="size-6" />
          )}
        </span>
      </button>
      {expanded && children != null && (
        <div className="px-4 pb-4 pt-0">{children}</div>
      )}
    </div>
  );
}

/** Context menu item: 40px height, 12px px, 6px gap, radio + label — Figma 1396-167722 */
function SortOptionRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-10 w-full items-center gap-1.5 px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6]"
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-[#161410] bg-[#161410]' : 'border-[#c8c4bb] bg-transparent'
        }`}
      >
        {selected && <Check className="size-3 text-white" strokeWidth={2.5} aria-hidden />}
      </span>
      <span className={selected ? 'text-[#161410]' : 'text-[#5e584b]'}>{label}</span>
    </button>
  );
}

export function PacksFilterBarMobile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<AccordionSection | null>('sort');
  const {
    searchQuery,
    onSearchQueryChange,
    sortId,
    onSortIdChange,
    selectedGenres,
    onToggleGenre,
    genreSearch,
    onGenreSearchChange,
    selectedKeywords,
    onToggleKeyword,
    keywordSearch,
    onKeywordSearchChange,
    accessId,
    onAccessIdChange,
    licenseId,
    onLicenseIdChange,
    selectedCreators,
    onToggleCreator,
    creatorSearch,
    onCreatorSearchChange,
    releasedId,
    onReleasedIdChange,
    onClearAllFilters,
    showSearchChip,
    searchChipQuery,
    onClearSearchQuery,
    searchResultCount,
  } = usePacksFilterBar();

  const filteredGenres = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    return q ? TOP_GENRES.filter((g) => g.name.toLowerCase().includes(q)) : TOP_GENRES;
  }, [genreSearch]);

  const filteredKeywords = useMemo(() => {
    const q = keywordSearch.trim().toLowerCase();
    return q ? KEYWORDS_OPTIONS.filter((k) => k.name.toLowerCase().includes(q)) : KEYWORDS_OPTIONS;
  }, [keywordSearch]);

  const filteredCreators = useMemo(() => {
    const q = creatorSearch.trim().toLowerCase();
    return q
      ? CREATOR_FILTER_OPTIONS.filter((c) => c.name.toLowerCase().includes(q))
      : CREATOR_FILTER_OPTIONS;
  }, [creatorSearch]);

  const activeFilterCount =
    (selectedGenres.size > 0 ? 1 : 0) +
    (selectedKeywords.size > 0 ? 1 : 0) +
    (accessId !== 'all' ? 1 : 0) +
    (licenseId !== 'all' ? 1 : 0) +
    (selectedCreators.size > 0 ? 1 : 0) +
    (releasedId !== 'all' ? 1 : 0);

  return (
    <>
      {/* Mobile bar: filter button + search — Figma 1455-155850 */}
      <div className="flex gap-4 items-center w-full px-0">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="relative size-10 shrink-0 flex items-center justify-center rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#161410]/5 transition-colors"
          aria-label="Sort and filters"
        >
          <SlidersHorizontal className="size-5" aria-hidden />
          {activeFilterCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#161410] text-white text-[10px] font-medium">
              {activeFilterCount}
            </span>
          )}
        </button>
        {showSearchChip && onClearSearchQuery != null ? (
          <div className="flex-1 min-w-0 flex items-center">
            <SearchQueryChip
              query={searchChipQuery ?? ''}
              resultCount={searchResultCount}
              onClear={onClearSearchQuery}
            />
          </div>
        ) : (
          <div className="flex-1 min-w-0 border border-[#d6ceb8] flex items-center gap-2 h-10 px-3 rounded-xs bg-transparent">
            <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search packs"
              className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 flex-1 min-w-0"
              aria-label="Search packs"
            />
          </div>
        )}
      </div>

      {/* Full-screen filters modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 w-full max-w-none h-full max-h-none rounded-none border-0 bg-[#fffbf0] flex flex-col p-0 !translate-x-0 !translate-y-0 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
        >
          <div className="flex items-center justify-between shrink-0 px-4 py-4 border-b border-[#e8e2d2]">
            <DialogTitle className="text-[#161410] text-lg font-bold leading-6 tracking-[0.1px]">
              Sort & Filters
            </DialogTitle>
            <DialogClose
              className="size-10 flex items-center justify-center rounded-full text-[#5e584b] hover:bg-[#e8e2d2] hover:text-[#161410] transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </DialogClose>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#fffbf0] pb-6">
            <AccordionRow
              label="Sort by"
              expanded={expandedSection === 'sort'}
              onToggle={() => setExpandedSection((s) => (s === 'sort' ? null : 'sort'))}
            >
              <div className="flex flex-col">
                {SORT_OPTIONS.map((option) => (
                  <SortOptionRow
                    key={option.id}
                    label={option.label}
                    selected={sortId === option.id}
                    onSelect={() => onSortIdChange(option.id)}
                  />
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="Genre"
              expanded={expandedSection === 'genre'}
              onToggle={() => setExpandedSection((s) => (s === 'genre' ? null : 'genre'))}
            >
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search genre"
                  value={genreSearch}
                  onChange={(e) => onGenreSearchChange(e.target.value)}
                  className="w-full rounded-xs border border-[#d6ceb8] bg-white px-4 py-2.5 text-sm text-[#161410] placeholder:text-[#7f7766]"
                  aria-label="Search genre"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredGenres.map((genre) => (
                    <button
                      key={genre.name}
                      type="button"
                      onClick={() => onToggleGenre(genre.name)}
                      className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-xs border ${
                          selectedGenres.has(genre.name)
                            ? 'border-[#161410] bg-[#161410]'
                            : 'border-[#c8c4bb] bg-transparent'
                        }`}
                      >
                        {selectedGenres.has(genre.name) && (
                          <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />
                        )}
                      </span>
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionRow>

            <AccordionRow
              label="Keywords"
              expanded={expandedSection === 'keywords'}
              onToggle={() => setExpandedSection((s) => (s === 'keywords' ? null : 'keywords'))}
            >
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search keywords"
                  value={keywordSearch}
                  onChange={(e) => onKeywordSearchChange(e.target.value)}
                  className="w-full rounded-xs border border-[#d6ceb8] bg-white px-4 py-2.5 text-sm text-[#161410] placeholder:text-[#7f7766]"
                  aria-label="Search keywords"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredKeywords.map((keyword) => (
                    <button
                      key={keyword.name}
                      type="button"
                      onClick={() => onToggleKeyword(keyword.name)}
                      className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-xs border ${
                          selectedKeywords.has(keyword.name)
                            ? 'border-[#161410] bg-[#161410]'
                            : 'border-[#c8c4bb] bg-transparent'
                        }`}
                      >
                        {selectedKeywords.has(keyword.name) && (
                          <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />
                        )}
                      </span>
                      {keyword.name}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionRow>

            <AccordionRow
              label="Access"
              expanded={expandedSection === 'access'}
              onToggle={() => setExpandedSection((s) => (s === 'access' ? null : 'access'))}
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {ACCESS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onAccessIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span className={accessId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'}>
                      {option.label}
                    </span>
                    {accessId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="License"
              expanded={expandedSection === 'license'}
              onToggle={() => setExpandedSection((s) => (s === 'license' ? null : 'license'))}
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {LICENSE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onLicenseIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span className={licenseId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'}>
                      {option.label}
                    </span>
                    {licenseId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="Creator"
              expanded={expandedSection === 'creator'}
              onToggle={() => setExpandedSection((s) => (s === 'creator' ? null : 'creator'))}
            >
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search creator"
                  value={creatorSearch}
                  onChange={(e) => onCreatorSearchChange(e.target.value)}
                  className="w-full rounded-xs border border-[#d6ceb8] bg-white px-4 py-2.5 text-sm text-[#161410] placeholder:text-[#7f7766]"
                  aria-label="Search creator"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredCreators.map((creator) => (
                    <button
                      key={creator.name}
                      type="button"
                      onClick={() => onToggleCreator(creator.name)}
                      className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-xs border ${
                          selectedCreators.has(creator.name)
                            ? 'border-[#161410] bg-[#161410]'
                            : 'border-[#c8c4bb] bg-transparent'
                        }`}
                      >
                        {selectedCreators.has(creator.name) && (
                          <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />
                        )}
                      </span>
                      {creator.name}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionRow>

            <AccordionRow
              label="Released"
              expanded={expandedSection === 'released'}
              onToggle={() => setExpandedSection((s) => (s === 'released' ? null : 'released'))}
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {RELEASED_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onReleasedIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span className={releasedId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'}>
                      {option.label}
                    </span>
                    {releasedId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>
          </div>

          {/* Footer: Clear + Apply — Figma 1396-167735 */}
          <div className="flex shrink-0 gap-3 p-4 border-t border-[#e8e2d2] bg-[#fffbf0]">
            <button
              type="button"
              onClick={() => {
                onClearAllFilters();
                setModalOpen(false);
              }}
              className="flex flex-1 items-center justify-center h-12 px-4 rounded-xs border border-[#d6ceb8] bg-transparent text-base font-medium leading-6 text-[#bfb6a1] hover:bg-[#f6f2e6] hover:text-[#5e584b] transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex flex-1 items-center justify-center h-12 px-4 rounded-xs bg-[#161410] text-base font-medium leading-6 text-[#fffbf0] hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
