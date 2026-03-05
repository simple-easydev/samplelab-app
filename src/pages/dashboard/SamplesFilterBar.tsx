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
  SAMPLE_KEY_OPTIONS,
  SAMPLE_BPM_OPTIONS,
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
  const [keyId, setKeyId] = useState<(typeof SAMPLE_KEY_OPTIONS)[number]['id']>('all');
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

  const handleClearAllFilters = () => {
    setSortId('newest');
    setSelectedGenres(new Set());
    setGenreSearch('');
    setSelectedKeywords(new Set());
    setKeywordSearch('');
    setInstrumentId('all');
    setTypeId('all');
    setStemsId('all');
    setKeyId('all');
    setBpmId('all');
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

          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Key"
              ariaLabel="Filter by key"
            />
            <FilterBarDropdown.Content width={120} className="py-1">
              {SAMPLE_KEY_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setKeyId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {keyId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
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
