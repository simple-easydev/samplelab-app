/**
 * Genres tab – Figma 821-60314.
 * Filter bar (Curated, A-Z), Search genres, and grid of GenreCards.
 */
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { GenreCard } from '@/components/GenreCard';
import { Input } from '@/components/ui/input';
import { GENRES_SORT_OPTIONS, GENRES_GRID_ITEMS } from './constants';

export function GenresTabContent() {
  const [sortId, setSortId] = useState<string>('curated');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGenres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = q
      ? GENRES_GRID_ITEMS.filter((g) => g.name.toLowerCase().includes(q))
      : GENRES_GRID_ITEMS;
    if (sortId === 'a-z') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchQuery, sortId]);

  return (
    <div className="mb-8 flex flex-col gap-8 relative">
      <div className="flex flex-col gap-8">
        {/* Filters + search – Figma 821-38780 */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 items-center">
            {GENRES_SORT_OPTIONS.map((option) => {
              const isSelected = sortId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortId(option.id)}
                  className={`flex h-10 items-center justify-center px-3 rounded-xs border shrink-0 font-medium text-sm leading-5 tracking-[0.1px] whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#e8e2d2] border-[#161410] text-[#161410]'
                      : 'border-[#d6ceb8] text-[#5e584b] bg-transparent hover:border-[#161410] hover:text-[#161410]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="border border-[#d6ceb8] flex h-10 items-center gap-2 px-3 rounded-xs w-[250px] shrink-0 bg-transparent">
            <Search className="size-5 shrink-0 text-[#7f7766]" aria-hidden />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search genres"
              className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
              aria-label="Search genres"
            />
          </div>
        </div>

        {/* Genre cards grid – Figma 821-38787, gap 24px */}
        <section className="w-full" aria-label="Genres">
          <div className="flex flex-wrap gap-6 items-center content-center w-full">
            {filteredGenres.map((genre) => (
              <GenreCard
                key={genre.name}
                name={genre.name}
                imageUrl={genre.imageUrl}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
