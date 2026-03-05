import { useState, useMemo } from 'react';
import { ChevronsUpDown, Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FilterBarDropdown } from '@/components/FilterBarDropdown';
import {
  TOP_GENRES,
  KEYWORDS_OPTIONS,
  ACCESS_OPTIONS,
  LICENSE_OPTIONS,
  CREATOR_FILTER_OPTIONS,
  RELEASED_OPTIONS,
} from './constants';

/** Sort options for packs – Figma 778-55100 */
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

export function PacksFilterBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<(typeof SORT_OPTIONS)[number]['id']>('newest');
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');
  const [keywordsDropdownOpen, setKeywordsDropdownOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [keywordSearch, setKeywordSearch] = useState('');
  const [accessId, setAccessId] = useState<(typeof ACCESS_OPTIONS)[number]['id']>('all');
  const [licenseId, setLicenseId] = useState<(typeof LICENSE_OPTIONS)[number]['id']>('all');
  const [creatorDropdownOpen, setCreatorDropdownOpen] = useState(false);
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [creatorSearch, setCreatorSearch] = useState('');
  const [releasedId, setReleasedId] = useState<(typeof RELEASED_OPTIONS)[number]['id']>('all');

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

  const handleGenreApply = () => {
    setGenreDropdownOpen(false);
  };

  const handleKeywordsClear = () => {
    setSelectedKeywords(new Set());
    setKeywordSearch('');
  };

  const handleKeywordsApply = () => {
    setKeywordsDropdownOpen(false);
  };

  const toggleCreator = (creator: string) => {
    setSelectedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creator)) next.delete(creator);
      else next.add(creator);
      return next;
    });
  };

  const handleCreatorsClear = () => {
    setSelectedCreators(new Set());
    setCreatorSearch('');
  };

  const handleCreatorsApply = () => {
    setCreatorDropdownOpen(false);
  };

  const handleClearAllFilters = () => {
    setSortId('newest');
    setSelectedGenres(new Set());
    setGenreSearch('');
    setSelectedKeywords(new Set());
    setKeywordSearch('');
    setAccessId('all');
    setLicenseId('all');
    setSelectedCreators(new Set());
    setCreatorSearch('');
    setReleasedId('all');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex flex-wrap items-center gap-6">
        {/* Sort */}
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

        {/* Filter group */}
        <div className="flex items-center">
          {/* Genre */}
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

          {/* Keywords */}
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

          {/* Access */}
          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Access"
              ariaLabel="Filter by access"
            />
            <FilterBarDropdown.Content width={180} className="py-1">
              {ACCESS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setAccessId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {accessId === option.id && (
                    <Check className="size-4 shrink-0 text-[#161410]" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          {/* License */}
          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="middle"
              label="License"
              ariaLabel="Filter by license"
            />
            <FilterBarDropdown.Content width={200} className="py-1">
              {LICENSE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setLicenseId(option.id)}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{option.label}</span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {licenseId === option.id && (
                      <Check className="size-4 text-[#161410]" aria-hidden />
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          {/* Creator */}
          <FilterBarDropdown open={creatorDropdownOpen} onOpenChange={setCreatorDropdownOpen}>
            <FilterBarDropdown.Trigger
              position="middle"
              label="Creator"
              badge={selectedCreators.size}
              ariaLabel="Filter by creator"
            />
            <FilterBarDropdown.Content width={280}>
              <FilterBarDropdown.Search
                value={creatorSearch}
                onChange={setCreatorSearch}
                placeholder="Search creator"
                ariaLabel="Search creator"
              />
              <FilterBarDropdown.List>
                {filteredCreators.length === 0 ? (
                  <div className="text-center py-5 px-4 text-[#b0ab9f] text-sm">
                    No creators found
                  </div>
                ) : (
                  filteredCreators.map((creator) => (
                    <FilterBarDropdown.CheckboxItem
                      key={creator.name}
                      label={creator.name}
                      checked={selectedCreators.has(creator.name)}
                      onToggle={() => toggleCreator(creator.name)}
                    />
                  ))
                )}
              </FilterBarDropdown.List>
              <FilterBarDropdown.Footer
                onClear={handleCreatorsClear}
                onApply={handleCreatorsApply}
                clearLabel="Clear"
                applyLabel="Apply"
              />
            </FilterBarDropdown.Content>
          </FilterBarDropdown>

          {/* Released */}
          <FilterBarDropdown>
            <FilterBarDropdown.Trigger
              position="right"
              label="Released"
              ariaLabel="Filter by release date"
            />
            <FilterBarDropdown.Content width={180} className="py-1">
              {RELEASED_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setReleasedId(option.id)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {releasedId === option.id && (
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

      {/* Search bar */}
      <div className="border border-[#d6ceb8] flex h-10 items-center gap-2 px-3 rounded-[2px] w-[250px] shrink-0 bg-transparent">
        <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search packs"
          className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
          aria-label="Search packs"
        />
      </div>
    </div>
  );
}
