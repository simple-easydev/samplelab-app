import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GenreCard } from '@/components/GenreCard';
import { getAllGenres } from '@/lib/supabase/genres';
import { GenresFilterBar } from './GenresFilterBar';

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
        <GenresFilterBar
          sortId={sortId}
          onSortIdChange={setSortId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          qFromUrl={qFromUrl}
          onClearSearch={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('q');
              return next;
            });
          }}
          resultCount={filteredGenres.length}
        />

        {/* Genre cards grid – Figma 821-38787, gap 24px */}
        <section className="w-full" aria-label="Genres">
          <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              <p className="text-[#5e584b] text-sm">Loading genres…</p>
            ) : (
              filteredGenres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/dashboard/genres/${genre.id}`}
                  className="contents"
                >
                  <GenreCard
                    name={getDisplayName(genre.name)}
                    imageUrl={genre.thumbnail_url ?? undefined}
                  />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
