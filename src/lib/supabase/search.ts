import { supabase } from './client';
import type { SampleItem } from './samples';
import type { PackRow } from './packs';
import type { CreatorWithCounts } from './creators';
import type { GenreDetailGenre } from './genres';

/**
 * Result shape from RPC search_library.
 * Each array has the same item shape as our existing list/detail types.
 */
export interface SearchLibraryResult {
  samples: SampleItem[];
  packs: PackRow[];
  creators: CreatorWithCounts[];
  genres: GenreDetailGenre[];
}

export interface SearchLibraryOptions {
  /**
   * Optional context: comma-separated list of "samples", "packs", "creators", "genres".
   * Omit or empty = search all.
   */
  p_context?: string | null;
}

/**
 * Call Supabase RPC search_library with trimmed query and optional context.
 * Returns typed { samples, packs, creators, genres }. On error, throws.
 */
export async function searchLibrary(
  query: string,
  options?: SearchLibraryOptions
): Promise<SearchLibraryResult> {
  const p_query = query.trim();
  const p_context = options?.p_context?.trim() || null;

  const { data, error } = await supabase.rpc('search_library', {
    p_query,
    p_context,
  });

  if (error) {
    console.error('Error calling search_library:', error);
    throw error;
  }

  if (!data || typeof data !== 'object') {
    return {
      samples: [],
      packs: [],
      creators: [],
      genres: [],
    };
  }

  const raw = data as {
    samples?: unknown[];
    packs?: unknown[];
    creators?: unknown[];
    genres?: unknown[];
  };

  return {
    samples: Array.isArray(raw.samples) ? (raw.samples as SampleItem[]) : [],
    packs: Array.isArray(raw.packs) ? (raw.packs as PackRow[]) : [],
    creators: Array.isArray(raw.creators) ? (raw.creators as CreatorWithCounts[]) : [],
    genres: Array.isArray(raw.genres) ? (raw.genres as GenreDetailGenre[]) : [],
  };
}
