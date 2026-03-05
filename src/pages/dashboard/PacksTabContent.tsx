import { useState, useMemo } from 'react';
import { ChevronsUpDown, ChevronDown, Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

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
      <style>{`
        .genre-dropdown-list::-webkit-scrollbar { width: 6px; }
        .genre-dropdown-list::-webkit-scrollbar-track { background: transparent; margin: 4px 0; }
        .genre-dropdown-list::-webkit-scrollbar-thumb { background: #d5d1ca; border-radius: 2px; }
        .genre-dropdown-list::-webkit-scrollbar-thumb:hover { background: #c0bcb4; }
      `}</style>
      {/* Filters + Search bar – Figma 756-47872 */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-6">
          {/* Sort icon button + dropdown – Figma 778-55100 (shadcn DropdownMenu) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="border border-[#a49a84] size-10 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#161410]/5 transition-colors shrink-0"
                aria-label="Sort"
              >
                <ChevronsUpDown className="size-5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px] p-0 rounded-[2px] border border-[#eae8e3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter group: Genre dropdown (reference design with search, custom checkboxes, Clear/Apply) */}
          <div className="flex items-center">
            <DropdownMenu open={genreDropdownOpen} onOpenChange={setGenreDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-10 px-3 flex items-center justify-center gap-1.5 border border-[#a49a84] bg-transparent text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:bg-[#161410]/5 transition-colors shrink-0 rounded-l-[2px]"
                  aria-label="Filter by genre"
                  aria-haspopup="menu"
                >
                  <span>Genre</span>
                  {selectedGenres.size > 0 && (
                    <span className="flex items-center justify-center size-5 rounded-[2px] bg-[#161410] text-white text-[11px] font-medium">
                      {selectedGenres.size}
                    </span>
                  )}
                  <ChevronDown className="size-5 shrink-0 text-[#161410]" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[280px] p-0 rounded-[2px] border border-[#eae8e3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
              >
                {/* Search field */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#edeae5]">
                  <Search className="size-4 shrink-0 text-[#b0ab9f]" strokeWidth={1.8} aria-hidden />
                  <input
                    type="text"
                    placeholder="Search genre"
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full outline-none border-0 bg-transparent text-[15px] text-[#3d3a34] placeholder:text-[#b0ab9f]"
                    aria-label="Search genre"
                  />
                </div>

                {/* Genre list */}
                <div className="max-h-[300px] overflow-y-auto py-1 genre-dropdown-list">
                  {filteredGenres.length === 0 ? (
                    <div className="text-center py-5 px-4 text-[#b0ab9f] text-sm">
                      No genres found
                    </div>
                  ) : (
                    filteredGenres.map((genre) => {
                      const isChecked = selectedGenres.has(genre.name);
                      return (
                        <button
                          key={genre.name}
                          type="button"
                          onClick={() => toggleGenre(genre.name)}
                          className="flex items-center gap-3 w-full text-left px-4 py-[11px] bg-transparent border-0 cursor-pointer text-[15px] text-[#3d3a34] hover:bg-[#faf9f6] transition-colors duration-120"
                          style={{ fontWeight: isChecked ? 500 : 400 }}
                        >
                          <span
                            className="flex items-center justify-center shrink-0 size-5 rounded-[2px] transition-colors duration-150"
                            style={{
                              border: isChecked ? 'none' : '1.5px solid #c8c4bb',
                              background: isChecked ? '#3d3a34' : 'transparent',
                            }}
                          >
                            {isChecked && (
                              <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />
                            )}
                          </span>
                          <span>{genre.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-4 py-3 border-t border-[#edeae5]">
                  <button
                    type="button"
                    onClick={handleGenreClear}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-[2px] border-[1.5px] border-[#ddd9d2] bg-white text-sm font-medium text-[#3d3a34] hover:bg-[#faf9f6] transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleGenreApply}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-[2px] border-0 bg-[#3d3a34] text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {PACK_FILTERS.slice(1).map((filter, index) => (
              <button
                key={filter.id}
                type="button"
                className={`h-10 px-3 flex items-center justify-center gap-1.5 border border-[#a49a84] bg-transparent text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:bg-[#161410]/5 transition-colors shrink-0 -ml-px ${
                  index === PACK_FILTERS.length - 2 ? 'rounded-r-[2px]' : ''
                }`}
              >
                <span>{filter.label}</span>
                <ChevronDown className="size-5 shrink-0 text-[#161410]" aria-hidden />
              </button>
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
