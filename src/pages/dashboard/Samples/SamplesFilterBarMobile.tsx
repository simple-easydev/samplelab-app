/**
 * Mobile Samples filter bar — same style as PacksFilterBarMobile (Figma 1396-167722).
 * Filter button + search; sort and filters in accordion-style full-screen modal.
 */
import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchQueryChip } from '@/components/SearchQueryChip';
import { Slider } from '@/components/ui/slider';
import { useSamplesFilterBar } from '@/contexts/SamplesFilterContext';
import {
  TOP_GENRES,
  KEYWORDS_OPTIONS,
  SAMPLE_INSTRUMENT_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_STEMS_OPTIONS,
  KEY_FILTER_FLAT_KEYS,
  KEY_FILTER_SHARP_KEYS,
  KEY_QUALITY_OPTIONS,
} from '../constants';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

const BPM_MIN = 0;
const BPM_MAX = 240;

type AccordionSection =
  | 'sort'
  | 'genre'
  | 'keywords'
  | 'instrument'
  | 'type'
  | 'stems'
  | 'key'
  | 'bpm';

/** Section row: 56px height, overline label + chevron — same as PacksFilterBarMobile */
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

/** Sort/radio row — same as PacksFilterBarMobile */
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

export function SamplesFilterBarMobile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<AccordionSection | null>('sort');
  const [keyTab, setKeyTab] = useState<'flat' | 'sharp'>('flat');
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
    instrumentId,
    onInstrumentIdChange,
    typeId,
    onTypeIdChange,
    stemsId,
    onStemsIdChange,
    selectedKeys,
    onToggleKey,
    keyQuality,
    onKeyQualityChange,
    bpmTab,
    onBpmTabChange,
    bpmRangeMin,
    bpmRangeMax,
    onBpmRangeChange,
    bpmExact,
    onBpmExactChange,
    onClearAllFilters,
    showSearchChip,
    searchChipQuery,
    onClearSearchQuery,
    searchResultCount,
  } = useSamplesFilterBar();

  const filteredGenres = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    return q ? TOP_GENRES.filter((g) => g.name.toLowerCase().includes(q)) : TOP_GENRES;
  }, [genreSearch]);

  const filteredKeywords = useMemo(() => {
    const q = keywordSearch.trim().toLowerCase();
    return q ? KEYWORDS_OPTIONS.filter((k) => k.name.toLowerCase().includes(q)) : KEYWORDS_OPTIONS;
  }, [keywordSearch]);

  const keyList = keyTab === 'flat' ? KEY_FILTER_FLAT_KEYS.flat() : KEY_FILTER_SHARP_KEYS.flat();

  const activeFilterCount =
    (selectedGenres.size > 0 ? 1 : 0) +
    (selectedKeywords.size > 0 ? 1 : 0) +
    (instrumentId !== 'all' ? 1 : 0) +
    (typeId !== 'all' ? 1 : 0) +
    (stemsId !== 'all' ? 1 : 0) +
    (selectedKeys.size > 0 || keyQuality !== 'all' ? 1 : 0) +
    (bpmTab === 'range'
      ? bpmRangeMin > BPM_MIN || bpmRangeMax < BPM_MAX
        ? 1
        : 0
      : bpmExact.trim() !== ''
        ? 1
        : 0);

  return (
    <>
      {/* Mobile bar: filter button + search — same as PacksFilterBarMobile */}
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
              placeholder="Search samples"
              className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 flex-1 min-w-0"
              aria-label="Search samples"
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
              label="Instrument"
              expanded={expandedSection === 'instrument'}
              onToggle={() =>
                setExpandedSection((s) => (s === 'instrument' ? null : 'instrument'))
              }
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {SAMPLE_INSTRUMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onInstrumentIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span
                      className={
                        instrumentId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'
                      }
                    >
                      {option.label}
                    </span>
                    {instrumentId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="Type"
              expanded={expandedSection === 'type'}
              onToggle={() => setExpandedSection((s) => (s === 'type' ? null : 'type'))}
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {SAMPLE_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onTypeIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span className={typeId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'}>
                      {option.label}
                    </span>
                    {typeId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="Stems"
              expanded={expandedSection === 'stems'}
              onToggle={() => setExpandedSection((s) => (s === 'stems' ? null : 'stems'))}
            >
              <div className="flex flex-col rounded-xs border border-[#e8e2d2] overflow-hidden bg-white">
                {SAMPLE_STEMS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onStemsIdChange(option.id)}
                    className="flex h-10 w-full items-center justify-between px-3 text-left text-sm text-[#161410] hover:bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0"
                  >
                    <span className={stemsId === option.id ? 'text-[#161410]' : 'text-[#5e584b]'}>
                      {option.label}
                    </span>
                    {stemsId === option.id && (
                      <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </AccordionRow>

            <AccordionRow
              label="Key"
              expanded={expandedSection === 'key'}
              onToggle={() => setExpandedSection((s) => (s === 'key' ? null : 'key'))}
            >
              <div className="flex flex-col gap-3">
                <div className="flex border-b border-[#e8e2d2]" role="tablist" aria-label="Key type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={keyTab === 'flat'}
                    onClick={() => setKeyTab('flat')}
                    className={
                      keyTab === 'flat'
                        ? 'flex-1 h-10 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-sm font-medium'
                        : 'flex-1 h-10 flex items-center justify-center px-2 text-[#7f7766] text-sm font-medium'
                    }
                  >
                    Flat keys
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={keyTab === 'sharp'}
                    onClick={() => setKeyTab('sharp')}
                    className={
                      keyTab === 'sharp'
                        ? 'flex-1 h-10 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-sm font-medium'
                        : 'flex-1 h-10 flex items-center justify-center px-2 text-[#7f7766] text-sm font-medium'
                    }
                  >
                    Sharp keys
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {keyList.map((keyName) => {
                    const selected = selectedKeys.has(keyName);
                    return (
                      <button
                        key={keyName}
                        type="button"
                        onClick={() => onToggleKey(keyName)}
                        className={`shrink-0 size-10 flex items-center justify-center rounded-[2px] border text-sm font-medium transition-colors ${
                          selected
                            ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                            : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:bg-[#faf9f6]'
                        }`}
                      >
                        {keyName}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 items-center" role="radiogroup" aria-label="Key quality">
                  {KEY_QUALITY_OPTIONS.map((opt) => {
                    const selected = keyQuality === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onKeyQualityChange(opt.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#161410]"
                      >
                        <span
                          className={`size-5 rounded-full shrink-0 flex items-center justify-center ${
                            selected ? 'bg-[#161410]' : 'border-[1.5px] border-[#c8c4bb] bg-transparent'
                          }`}
                          aria-hidden
                        />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AccordionRow>

            <AccordionRow
              label="BPM"
              expanded={expandedSection === 'bpm'}
              onToggle={() => setExpandedSection((s) => (s === 'bpm' ? null : 'bpm'))}
            >
              <div className="flex flex-col gap-3">
                <div className="flex border-b border-[#e8e2d2]" role="tablist" aria-label="BPM type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={bpmTab === 'range'}
                    onClick={() => onBpmTabChange('range')}
                    className={
                      bpmTab === 'range'
                        ? 'flex-1 h-10 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-sm font-medium'
                        : 'flex-1 h-10 flex items-center justify-center px-2 text-[#7f7766] text-sm font-medium'
                    }
                  >
                    Range
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={bpmTab === 'exact'}
                    onClick={() => onBpmTabChange('exact')}
                    className={
                      bpmTab === 'exact'
                        ? 'flex-1 h-10 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-sm font-medium'
                        : 'flex-1 h-10 flex items-center justify-center px-2 text-[#7f7766] text-sm font-medium'
                    }
                  >
                    Exact
                  </button>
                </div>
                {bpmTab === 'range' ? (
                  <div className="h-12 flex items-center gap-3 w-full">
                    <span
                      className="text-sm text-[#161410] shrink-0 w-6 tabular-nums"
                      aria-hidden
                    >
                      {bpmRangeMin}
                    </span>
                    <Slider
                      value={[bpmRangeMin, bpmRangeMax]}
                      onValueChange={(v) =>
                        onBpmRangeChange(v[0] ?? BPM_MIN, v[1] ?? BPM_MAX)
                      }
                      min={BPM_MIN}
                      max={BPM_MAX}
                      step={1}
                      className="flex-1 min-w-0 [&_[data-slot=slider-track]]:bg-[#e8e2d2] [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-range]]:bg-[#161410] [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#161410] [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <span
                      className="text-sm text-[#161410] shrink-0 w-8 tabular-nums text-right"
                      aria-hidden
                    >
                      {bpmRangeMax}
                    </span>
                  </div>
                ) : (
                  <Input
                    type="number"
                    min={BPM_MIN}
                    max={BPM_MAX}
                    placeholder="0 - 240"
                    value={bpmExact}
                    onChange={(e) => onBpmExactChange(e.target.value)}
                    className="h-12 rounded-[2px] border-[#d6ceb8] text-sm text-[#161410] placeholder:text-[#7f7766]"
                    aria-label="Exact BPM value"
                  />
                )}
              </div>
            </AccordionRow>
          </div>

          {/* Footer: Clear + Apply — same as PacksFilterBarMobile */}
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
