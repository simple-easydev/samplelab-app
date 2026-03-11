/**
 * Mobile Packs filter bar — Figma 1455-155850.
 * Filter button + search; sort and filters open in a full-screen modal.
 */
import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X, Check } from 'lucide-react';
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

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

export type PacksFilterBarMobileSortId = (typeof SORT_OPTIONS)[number]['id'];
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

function ModalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[#7f7766] text-[10px] leading-4 tracking-[1px] uppercase font-normal">
        {title}
      </p>
      {children}
    </div>
  );
}

export function PacksFilterBarMobile() {
  const [modalOpen, setModalOpen] = useState(false);
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
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 w-full max-w-none h-full max-h-none rounded-none border-0 bg-[#fffbf0] flex flex-col p-0 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
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

          <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8">
            <ModalSection title="Sort">
              <div className="flex flex-col gap-0 rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSortIdChange(option.id)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    {option.label}
                    {sortId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </ModalSection>

            <ModalSection title="Genre">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search genre"
                  value={genreSearch}
                  onChange={(e) => onGenreSearchChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xs border border-[#d6ceb8] text-sm text-[#161410] placeholder:text-[#7f7766] bg-white"
                  aria-label="Search genre"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col gap-0 rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredGenres.map((genre) => (
                    <button
                      key={genre.name}
                      type="button"
                      onClick={() => onToggleGenre(genre.name)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`shrink-0 size-5 rounded-xs border flex items-center justify-center ${
                          selectedGenres.has(genre.name)
                            ? 'bg-[#161410] border-[#161410]'
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
            </ModalSection>

            <ModalSection title="Keywords">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search keywords"
                  value={keywordSearch}
                  onChange={(e) => onKeywordSearchChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xs border border-[#d6ceb8] text-sm text-[#161410] placeholder:text-[#7f7766] bg-white"
                  aria-label="Search keywords"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col gap-0 rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredKeywords.map((keyword) => (
                    <button
                      key={keyword.name}
                      type="button"
                      onClick={() => onToggleKeyword(keyword.name)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`shrink-0 size-5 rounded-xs border flex items-center justify-center ${
                          selectedKeywords.has(keyword.name)
                            ? 'bg-[#161410] border-[#161410]'
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
            </ModalSection>

            <ModalSection title="Access">
              <div className="flex flex-col gap-0 rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {ACCESS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onAccessIdChange(option.id)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    {option.label}
                    {accessId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </ModalSection>

            <ModalSection title="License">
              <div className="flex flex-col gap-0 rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {LICENSE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onLicenseIdChange(option.id)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    {option.label}
                    {licenseId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </ModalSection>

            <ModalSection title="Creator">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search creator"
                  value={creatorSearch}
                  onChange={(e) => onCreatorSearchChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xs border border-[#d6ceb8] text-sm text-[#161410] placeholder:text-[#7f7766] bg-white"
                  aria-label="Search creator"
                />
                <div className="max-h-48 overflow-y-auto flex flex-col gap-0 rounded-xs border border-[#e8e2d2] bg-white">
                  {filteredCreators.map((creator) => (
                    <button
                      key={creator.name}
                      type="button"
                      onClick={() => onToggleCreator(creator.name)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                    >
                      <span
                        className={`shrink-0 size-5 rounded-xs border flex items-center justify-center ${
                          selectedCreators.has(creator.name)
                            ? 'bg-[#161410] border-[#161410]'
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
            </ModalSection>

            <ModalSection title="Released">
              <div className="flex flex-col gap-0 rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {RELEASED_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onReleasedIdChange(option.id)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    {option.label}
                    {releasedId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </ModalSection>

            <button
              type="button"
              onClick={() => {
                onClearAllFilters();
                setModalOpen(false);
              }}
              className="text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] underline hover:no-underline"
            >
              Clear all filters
            </button>
          </div>

          <div className="shrink-0 p-4 border-t border-[#e8e2d2]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-3 rounded-xs bg-[#161410] text-white text-sm font-medium leading-5 tracking-[0.1px] hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
