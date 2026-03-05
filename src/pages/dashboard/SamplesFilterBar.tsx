/**
 * Samples tab filter bar – Figma 812-47896 (filters+search).
 * Sort button, filter group (Genre, Keywords, Instrument, Type, Stems, Key, BPM), Clear Filters, search bar.
 */
import { useState, useMemo } from 'react';
import { ChevronsUpDown, Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FilterBarDropdown } from '@/components/FilterBarDropdown';
import {
  TOP_GENRES,
  KEYWORDS_OPTIONS,
  SAMPLE_INSTRUMENT_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_STEMS_OPTIONS,
  SAMPLE_BPM_OPTIONS,
  KEY_FILTER_FLAT_KEYS,
  KEY_FILTER_SHARP_KEYS,
  KEY_QUALITY_OPTIONS,
} from './constants';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

export function SamplesFilterBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<(typeof SORT_OPTIONS)[number]['id']>('newest');
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');
  const [keywordsDropdownOpen, setKeywordsDropdownOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [keywordSearch, setKeywordSearch] = useState('');
  const [instrumentId, setInstrumentId] = useState<(typeof SAMPLE_INSTRUMENT_OPTIONS)[number]['id']>('all');
  const [typeId, setTypeId] = useState<(typeof SAMPLE_TYPE_OPTIONS)[number]['id']>('all');
  const [stemsId, setStemsId] = useState<(typeof SAMPLE_STEMS_OPTIONS)[number]['id']>('all');
  const [keyDropdownOpen, setKeyDropdownOpen] = useState(false);
  const [keyTab, setKeyTab] = useState<'flat' | 'sharp'>('flat');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [keyQuality, setKeyQuality] = useState<(typeof KEY_QUALITY_OPTIONS)[number]['id']>('all');
  const [bpmId, setBpmId] = useState<(typeof SAMPLE_BPM_OPTIONS)[number]['id']>('all');

  const filteredGenres = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    return q ? TOP_GENRES.filter((g) => g.name.toLowerCase().includes(q)) : TOP_GENRES;
  }, [genreSearch]);

  const filteredKeywords = useMemo(() => {
    const q = keywordSearch.trim().toLowerCase();
    return q ? KEYWORDS_OPTIONS.filter((k) => k.name.toLowerCase().includes(q)) : KEYWORDS_OPTIONS;
  }, [keywordSearch]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) next.delete(keyword);
      else next.add(keyword);
      return next;
    });
  };

  const handleGenreClear = () => {
    setSelectedGenres(new Set());
    setGenreSearch('');
  };

  const handleGenreApply = () => setGenreDropdownOpen(false);

  const handleKeywordsClear = () => {
    setSelectedKeywords(new Set());
    setKeywordSearch('');
  };

  const handleKeywordsApply = () => setKeywordsDropdownOpen(false);

  const handleKeyClear = () => {
    setSelectedKeys(new Set());
    setKeyQuality('all');
  };

  const handleKeyApply = () => setKeyDropdownOpen(false);

  const handleClearAllFilters = () => {
    setSortId('newest');
    setSelectedGenres(new Set());
    setGenreSearch('');
    setSelectedKeywords(new Set());
    setKeywordSearch('');
    setInstrumentId('all');
    setTypeId('all');
    setStemsId('all');
    setSelectedKeys(new Set());
    setKeyQuality('all');
    setBpmId('all');
  };

  const toggleKey = (keyName: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyName)) next.delete(keyName);
      else next.add(keyName);
      return next;
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex flex-wrap items-center gap-6">
        <FilterBarDropdown>
          <FilterBarDropdown.Trigger position="standalone" ariaLabel="Sort">
            <ChevronsUpDown className="size-5" aria-hidden />
          </FilterBarDropdown.Trigger>
          <FilterBarDropdown.Content width={180} className="py-1">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => setSortId(option.id)}
                className="flex items-center justify-between"
              >
                {option.label}
                {sortId === option.id && (
                  <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                )}
              </DropdownMenuItem>
            ))}
          </FilterBarDropdown.Content>
        </FilterBarDropdown>

        <div className="flex items-center">
          <FilterBarDropdown open={genreDropdownOpen} onOpenChange={setGenreDropdownOpen}>
            <FilterBarDropdown.Trigger
              position="left"
              label="Genre"
              badge={selectedGenres.size}
              ariaLabel="Filter by genre"
            />
            <FilterBarDropdown.Content width={280}>
              <FilterBarDropdown.Search
                value={genreSearch}
                onChange={setGenreSearch}
                placeholder="Search genre"
                ariaLabel="Search genre"
              />
              <FilterBarDropdown.List>
                {filteredGenres.length === 0 ? (
                  <div className="text-center py-5 px-4 text-[#b0ab9f] text-sm">
                    No genres found
                  </div>
                ) : (
                  filteredGenres.map((genre) => (
                    <FilterBarDropdown.CheckboxItem
                      key={genre.name}
                      label={genre.name}
                      checked={selectedGenres.has(genre.name)}
                      onToggle={() => toggleGenre(genre.name)}
                    />
                  ))
                )}
              </FilterBarDropdown.List>
              <FilterBarDropdown.Footer
                onClear={handleGenreClear}
                onApply={handleGenreApply}
                clearLabel="Clear"
                applyLabel="Apply"
              />
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown open={keywordsDropdownOpen} onOpenChange={setKeywordsDropdownOpen}>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Keywords"
              badge={selectedKeywords.size}
              ariaLabel="Filter by keywords"
            />
            <FilterBarDropdown.Content width={280}>
              <FilterBarDropdown.Search
                value={keywordSearch}
                onChange={setKeywordSearch}
                placeholder="Search keywords"
                ariaLabel="Search keywords"
              />
              <FilterBarDropdown.List>
                {filteredKeywords.length === 0 ? (
                  <div className="text-center py-5 px-4 text-[#b0ab9f] text-sm">
                    No keywords found
                  </div>
                ) : (
                  filteredKeywords.map((keyword) => (
                    <FilterBarDropdown.CheckboxItem
                      key={keyword.name}
                      label={keyword.name}
                      checked={selectedKeywords.has(keyword.name)}
                      onToggle={() => toggleKeyword(keyword.name)}
                    />
                  ))
                )}
              </FilterBarDropdown.List>
              <FilterBarDropdown.Footer
                onClear={handleKeywordsClear}
                onApply={handleKeywordsApply}
                clearLabel="Clear"
                applyLabel="Apply"
              />
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Instrument"
              ariaLabel="Filter by instrument"
            />
            <FilterBarDropdown.Content width={180} className="py-1">
              {SAMPLE_INSTRUMENT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setInstrumentId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {instrumentId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Type"
              ariaLabel="Filter by type"
            />
            <FilterBarDropdown.Content width={180} className="py-1">
              {SAMPLE_TYPE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setTypeId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {typeId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Stems"
              ariaLabel="Filter by stems"
            />
            <FilterBarDropdown.Content width={180} className="py-1">
              {SAMPLE_STEMS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setStemsId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {stemsId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown open={keyDropdownOpen} onOpenChange={setKeyDropdownOpen}>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Key"
              badge={selectedKeys.size > 0 ? selectedKeys.size : undefined}
              ariaLabel="Filter by key"
            />
            <FilterBarDropdown.Content width={360} className="p-0 flex flex-col overflow-hidden">
              {/* Tabs – Figma 812-69672, 812-70161 */}
              <div className="flex border-b border-[#e8e2d2]" role="tablist" aria-label="Key type">
                <button
                  type="button"
                  role="tab"
                  aria-selected={keyTab === 'flat'}
                  onClick={() => setKeyTab('flat')}
                  className={keyTab === 'flat'
                    ? 'flex-1 h-12 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-base font-medium leading-6'
                    : 'flex-1 h-12 flex items-center justify-center px-2 text-[#7f7766] text-base font-medium leading-6'}
                >
                  Flat keys
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={keyTab === 'sharp'}
                  onClick={() => setKeyTab('sharp')}
                  className={keyTab === 'sharp'
                    ? 'flex-1 h-12 flex items-center justify-center px-2 border-b-2 border-[#161410] text-[#161410] text-base font-medium leading-6'
                    : 'flex-1 h-12 flex items-center justify-center px-2 text-[#7f7766] text-base font-medium leading-6'}
                >
                  Sharp keys
                </button>
              </div>
              {/* Key grid + radio + footer */}
              <div className="flex flex-col gap-6 px-7 py-6">
                <div className="flex gap-1">
                  {(keyTab === 'flat' ? KEY_FILTER_FLAT_KEYS : KEY_FILTER_SHARP_KEYS).map((column, colIdx) => (
                    <div key={colIdx} className={colIdx === 0 ? 'flex flex-col gap-1 w-[128px]' : 'flex flex-col gap-1'}>
                      {colIdx === 0 ? (
                        <>
                          <div className="flex gap-1">
                            {column.slice(0, 2).map((keyName) => {
                              const selected = selectedKeys.has(keyName);
                              return (
                                <button
                                  key={keyName}
                                  type="button"
                                  onClick={() => toggleKey(keyName)}
                                  className={`shrink-0 size-10 flex items-center justify-center rounded-[2px] border text-sm font-medium tracking-[0.1px] transition-colors
                                    ${selected
                                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                                      : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:bg-[#faf9f6]'}`}
                                >
                                  {keyName}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-1">
                            {column.slice(2, 5).map((keyName) => {
                              const selected = selectedKeys.has(keyName);
                              return (
                                <button
                                  key={keyName}
                                  type="button"
                                  onClick={() => toggleKey(keyName)}
                                  className={`shrink-0 size-10 flex items-center justify-center rounded-[2px] border text-sm font-medium tracking-[0.1px] transition-colors
                                    ${selected
                                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                                      : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:bg-[#faf9f6]'}`}
                                >
                                  {keyName}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-1">
                            {column.slice(0, 3).map((keyName) => {
                              const selected = selectedKeys.has(keyName);
                              return (
                                <button
                                  key={keyName}
                                  type="button"
                                  onClick={() => toggleKey(keyName)}
                                  className={`shrink-0 size-10 flex items-center justify-center rounded-[2px] border text-sm font-medium tracking-[0.1px] transition-colors
                                    ${selected
                                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                                      : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:bg-[#faf9f6]'}`}
                                >
                                  {keyName}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-1">
                            {column.slice(3, 7).map((keyName) => {
                              const selected = selectedKeys.has(keyName);
                              return (
                                <button
                                  key={keyName}
                                  type="button"
                                  onClick={() => toggleKey(keyName)}
                                  className={`shrink-0 size-10 flex items-center justify-center rounded-[2px] border text-sm font-medium tracking-[0.1px] transition-colors
                                    ${selected
                                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                                      : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:bg-[#faf9f6]'}`}
                                >
                                  {keyName}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {/* All / Major / Minor – radio row */}
                <div className="flex gap-6 items-center justify-center" role="radiogroup" aria-label="Key quality">
                  {KEY_QUALITY_OPTIONS.map((opt) => {
                    const selected = keyQuality === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setKeyQuality(opt.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#161410] tracking-[0.1px]"
                      >
                        <span
                          className={`size-5 rounded-full shrink-0 flex items-center justify-center transition-colors
                            ${selected ? 'bg-[#161410]' : 'border-[1.5px] border-[#c8c4bb] bg-transparent'}`}
                          aria-hidden
                        />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <FilterBarDropdown.Footer
                onClear={handleKeyClear}
                onApply={handleKeyApply}
                clearLabel="Clear"
                applyLabel="Apply"
              />
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="right"
              label="BPM"
              ariaLabel="Filter by BPM"
            />
            <FilterBarDropdown.Content width={160} className="py-1">
              {SAMPLE_BPM_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setBpmId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {bpmId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>
        </div>

        <button
          type="button"
          onClick={handleClearAllFilters}
          className="text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] underline hover:no-underline shrink-0"
        >
          Clear Filters
        </button>
      </div>

      <div className="border border-[#d6ceb8] flex h-10 items-center gap-2 px-3 rounded-[2px] w-[250px] shrink-0 bg-transparent">
        <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search samples"
          className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
          aria-label="Search samples"
        />
      </div>
    </div>
  );
}
