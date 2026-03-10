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

