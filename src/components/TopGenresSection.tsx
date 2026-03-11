import { Link } from 'react-router-dom';
import { CardCarousel } from '@/components/CardCarousel';
import { GenreCard } from '@/components/GenreCard';
import { TOP_GENRES, genreNameToSlug } from '@/pages/dashboard/constants';

export interface TopGenreItem {
  name: string;
  imageUrl?: string;
}

export interface TopGenresSectionProps {
  /** Genres to display. Defaults to TOP_GENRES from constants. */
  genres?: TopGenreItem[];
}

export function TopGenresSection({ genres = TOP_GENRES }: TopGenresSectionProps) {
  return (
    <CardCarousel title="Top genres" ctaLabel="View all genres">
      {genres.map((genre) => (
        <Link
          key={genre.name}
          to={`/dashboard/genres/${genreNameToSlug(genre.name)}`}
          className="contents"
        >
          <GenreCard name={genre.name} imageUrl={genre.imageUrl} lockDesktop />
        </Link>
      ))}
    </CardCarousel>
  );
}
