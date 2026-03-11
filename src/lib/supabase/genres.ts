import { supabase } from './client';

/**
 * Genre row returned by RPC get_all_genres (admin library Genres tab).
 */
export interface GenreRow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  packs_count: number;
  samples_count: number;
  thumbnail_url: string | null;
}

/**
 * Fetch all genres with pack and sample counts via RPC get_all_genres.
 * Auth: authenticated or service_role.
 */
export async function getAllGenres(): Promise<GenreRow[]> {
  const { data, error } = await supabase.rpc('get_all_genres');

  if (error) {
    console.error('Error fetching genres:', error);
    return [];
  }

  return Array.isArray(data) ? (data as GenreRow[]) : [];
}

/**
 * Row shape returned by get_top_ranked_genres RPC (for Top genres carousel).
 */
export interface TopRankedGenreRow {
  id?: string;
  name: string;
  thumbnail_url?: string | null;
}

/**
 * Fetch top ranked genres via Supabase RPC get_top_ranked_genres.
 * Returns empty array on error or if RPC is not deployed.
 */
export async function getTopRankedGenres(): Promise<TopRankedGenreRow[]> {
  const { data, error } = await supabase.rpc('get_top_ranked_genres');

  if (error) {
    console.error('Error fetching top ranked genres:', error);
    return [];
  }

  return Array.isArray(data) ? (data as TopRankedGenreRow[]) : [];
}

