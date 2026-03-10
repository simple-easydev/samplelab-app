import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { GenreCard } from '@/components/GenreCard';
import { getAllGenres } from '@/lib/supabase/genres';
import { genreNameToSlug } from './constants';
import { Input } from '@/components/ui/input';
import { SearchQueryChip } from '@/components/SearchQueryChip';
import { GENRES_SORT_OPTIONS } from './constants';

function getDisplayName(name: string): string {
  if (!name) return name;
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function GenresTabContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [sortId, setSortId] = useState<string>('curated');
  const [searchQuery, setSearchQuery] = useState('');
   const [genres, setGenres] = useState<Awaited<ReturnType<typeof getAllGenres>>>([]);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getAllGenres()
      .then((data) => {
        if (!cancelled) {
          setGenres(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredGenres = useMemo(() => {
    const raw = qFromUrl.trim() || searchQuery.trim();
    const q = raw.toLowerCase();
    const list = q
      ? genres.filter((g) => g.name.toLowerCase().includes(q))
      : genres;
    if (sortId === 'a-z') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [qFromUrl, searchQuery, sortId, genres]);

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
          {qFromUrl.trim() ? (
            <SearchQueryChip
              query={qFromUrl}
              resultCount={filteredGenres.length}
              onClear={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete('q');
                  return next;
                });
              }}
            />
          ) : (
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
          )}
        </div>

        {/* Genre cards grid – Figma 821-38787, gap 24px */}
        <section className="w-full" aria-label="Genres">
          <div className="flex flex-wrap gap-6 items-center content-center w-full">
            {loading ? (
              <p className="text-[#5e584b] text-sm">Loading genres…</p>
            ) : (
              filteredGenres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/dashboard/genres/${genreNameToSlug(genre.name)}`}
                  className="contents"
                >
                  <GenreCard name={getDisplayName(genre.name)} />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
