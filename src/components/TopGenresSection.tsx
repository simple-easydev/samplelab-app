import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardCarousel } from '@/components/CardCarousel';
import { GenreCard } from '@/components/GenreCard';
import { getTopRankedGenres, type TopRankedGenreRow } from '@/lib/supabase/genres';
import { genreNameToSlug } from '@/pages/dashboard/constants';

export interface TopGenresSectionProps {
  /** Optional initial/fallback genres while loading or on error. */
  fallbackGenres?: TopRankedGenreRow[];
}

export function TopGenresSection({ fallbackGenres = [] }: TopGenresSectionProps) {
  const [genres, setGenres] = useState<TopRankedGenreRow[]>(fallbackGenres);

  useEffect(() => {
    getTopRankedGenres().then((rows) => {
      if (rows.length > 0) {
        setGenres(rows);
      }
    });
  }, []);

  return (
    <CardCarousel title="Top genres" ctaLabel="View all genres">
      {genres.map((genre) => (
        <Link
          key={genre.name}
          to={`/dashboard/genres/${genreNameToSlug(genre.name)}`}
          className="contents"
        >
          <GenreCard
            name={genre.name}
            imageUrl={genre.thumbnail_url ?? undefined}
            lockDesktop
          />
        </Link>
      ))}
    </CardCarousel>
  );
}
