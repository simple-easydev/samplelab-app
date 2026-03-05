import { useState, useMemo } from 'react';
import { ChevronsUpDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Check } from 'lucide-react';
import { FilterBarDropdown } from '@/components/FilterBarDropdown';
import { TOP_GENRES } from './constants';

const PACK_FILTERS = [
  { id: 'genre', label: 'Genre' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'access', label: 'Access' },
  { id: 'license', label: 'License' },
  { id: 'creator', label: 'Creator' },
  { id: 'released', label: 'Released' },
] as const;

/** Sort options for packs – Figma 778-55100 */
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

export function PacksTabContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<(typeof SORT_OPTIONS)[number]['id']>('newest');
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');

  const filteredGenres = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    return q ? TOP_GENRES.filter((g) => g.name.toLowerCase().includes(q)) : TOP_GENRES;
  }, [genreSearch]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
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

  return (
    <div className="mb-8 flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-6">
          {/* Sort – shared FilterBarDropdown, standalone trigger */}
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

          {/* Filter group: Genre + other filters – shared FilterBarDropdown */}
          <div className="flex items-center">
            {/* Genre – with search, checkboxes, footer */}
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

            {/* Other filters (Keywords, Access, License, Creator, Released) – same trigger style, placeholder content for now */}
            {PACK_FILTERS.slice(1).map((filter, index) => (
              <FilterBarDropdown key={filter.id}>
                <FilterBarDropdown.Trigger
                  position={index === PACK_FILTERS.length - 2 ? 'right' : 'middle'}
                  label={filter.label}
                  ariaLabel={`Filter by ${filter.label.toLowerCase()}`}
                />
                <FilterBarDropdown.Content width={280}>
                  <FilterBarDropdown.List>
                    <div className="text-center py-5 px-4 text-[#b0ab9f] text-sm">
                      {filter.label} options – coming soon
                    </div>
                  </FilterBarDropdown.List>
                </FilterBarDropdown.Content>
              </FilterBarDropdown>
            ))}
          </div>

          <button
            type="button"
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
    </div>
  );
}
