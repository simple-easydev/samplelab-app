import { supabase } from './client';
import type { SampleItem } from './samples';
import type { PackRow } from './packs';
import type { CreatorWithCounts } from './creators';

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
 * Genre slice returned inside get_genre_detail_by_id (genre detail page hero).
 */
export interface GenreDetailGenre {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  samples_count: number;
  packs_count: number;
}

/**
 * Full genre detail returned by RPC get_genre_detail_by_id (genre detail page).
 */
export interface GenreDetail {
  genre: GenreDetailGenre | null;
  samples: SampleItem[];
  packs: PackRow[];
  creators: CreatorWithCounts[];
}

/**
 * Fetch genre detail by id via RPC get_genre_detail_by_id (genre, samples, packs, creators).
 * Returns null when genre is not found or on error.
 */
export async function getGenreDetailById(genreId: string): Promise<GenreDetail | null> {
  const { data, error } = await supabase.rpc('get_genre_detail_by_id', {
    p_genre_id: genreId,
  });

  if (error) {
    console.error('Error fetching genre detail:', error);
    return null;
  }

  if (!data || typeof data !== 'object') return null;

  const raw = data as {
    genre?: GenreDetailGenre | null;
    samples?: unknown[];
    packs?: unknown[];
    creators?: unknown[];
  };
  return {
    genre: raw.genre ?? null,
    samples: Array.isArray(raw.samples) ? (raw.samples as SampleItem[]) : [],
    packs: Array.isArray(raw.packs) ? (raw.packs as PackRow[]) : [],
    creators: Array.isArray(raw.creators) ? (raw.creators as CreatorWithCounts[]) : [],
  };
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

