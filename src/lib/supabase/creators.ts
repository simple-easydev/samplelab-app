import { supabase } from './client';

/**
 * Creator row with aggregated pack and sample counts (from RPC get_creators_with_counts).
 * Types match the RPC return; when the DB adds this function, you can align with database.ts.
 */
export interface CreatorWithCounts {
  id: string;
  name: string;
  avatar_url: string | null;
  packs_count: number;
  samples_count: number;
}

/** Pack shape returned by get_creator_by_id */
export interface CreatorDetailPack {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  is_premium: boolean | null;
  status: string;
  download_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Sample shape returned by get_creator_by_id */
export interface CreatorDetailSample {
  id: string;
  pack_id: string;
  name: string;
  audio_url: string;
  bpm: number | null;
  key: string | null;
  type: string;
  length: string | null;
  file_size_bytes: number | null;
  credit_cost: number | null;
  status: string;
  has_stems: boolean | null;
  download_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Similar creator shape returned by get_creator_by_id */
export interface CreatorDetailSimilarCreator {
  id: string;
  name: string;
  avatar_url: string | null;
}

/** Full creator detail from get_creator_by_id RPC */
export interface CreatorDetail {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  packs_count: number;
  samples_count: number;
  tags: string[];
  genres: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  packs: CreatorDetailPack[];
  samples: CreatorDetailSample[];
  similar_creators: CreatorDetailSimilarCreator[];
}

export interface GetCreatorsWithCountsOptions {
  /** Optional search filter on creator name (case-insensitive). */
  p_search?: string | null;
  /** Max rows to return. Default 100. */
  p_limit?: number;
  /** Offset for pagination. Default 0. */
  p_offset?: number;
}

/**
 * Fetch creators with pack and sample counts via Supabase RPC get_creators_with_counts.
 * Requires the RPC to exist in the database (see prompt in docs or admin project).
 */
export async function getCreatorsWithCounts(
  options?: GetCreatorsWithCountsOptions
): Promise<CreatorWithCounts[]> {
  const { data, error } = await supabase.rpc('get_creators_with_counts', {
    p_search: options?.p_search ?? null,
    p_limit: options?.p_limit ?? 100,
    p_offset: options?.p_offset ?? 0,
  });

  if (error) {
    console.error('Error fetching creators with counts:', error);
    return [];
  }

  return Array.isArray(data) ? (data as CreatorWithCounts[]) : [];
}

/**
 * Fetch featured creators via Supabase RPC get_featured_creators.
 * Returns empty array on error or if RPC is not deployed.
 */
export async function getFeaturedCreators(): Promise<CreatorWithCounts[]> {
  const { data, error } = await supabase.rpc('get_featured_creators');

  if (error) {
    console.error('Error fetching featured creators:', error);
    return [];
  }

  return Array.isArray(data) ? (data as CreatorWithCounts[]) : [];
}

/**
 * Fetch full creator detail by id via RPC get_creator_by_id (packs, samples, similar_creators, etc.).
 */
export async function getCreatorById(id: string): Promise<CreatorDetail | null> {
  const { data, error } = await supabase.rpc('get_creator_by_id', {
    p_creator_id: id,
  });

  if (error) {
    console.error('Error fetching creator by id:', error);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  return (row as CreatorDetail) ?? null;
}
