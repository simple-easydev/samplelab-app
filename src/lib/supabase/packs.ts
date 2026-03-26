import { supabase } from './client';

/**
 * Pack row returned by RPC get_all_packs (admin library Packs tab).
 * Matches API: id, name, creator_name, category_name, genres, tags, samples_count, etc.
 */
export interface PackRow {
  id: string;
  name: string;
  creator_id: string | null;
  category_id: string | null;
  creator_name: string;
  category_name: string;
  genres: string[] | null;
  tags: string[] | null;
  samples_count: number;
  download_count: number;
  status: string;
  cover_url: string | null;
  created_at: string;
  is_premium: boolean;
}

/** Sample shape returned by get_pack_by_id (samples in pack). */
export interface PackDetailSample {
  id: string;
  pack_id: string;
  name: string;
  preview_audio_url: string;
  metadata:any;
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

/** Similar pack shape returned by get_pack_by_id (for carousel). */
export interface PackDetailSimilarPack {
  id: string;
  name: string;
  creator_name: string;
  cover_url: string | null;
  samples_count: number;
  category_name?: string;
  genres?: string[] | null;
  is_premium?: boolean;
}

/** Full pack detail from get_pack_by_id RPC. */
export interface PackDetail {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  creator_id: string | null;
  creator_name: string;
  category_id: string | null;
  category_name: string;
  genres: string[] | null;
  tags: string[] | null;
  is_premium: boolean;
  samples_count: number;
  download_count: number;
  status: string;
  created_at: string;
  samples: PackDetailSample[];
  similar_packs: PackDetailSimilarPack[];
}

/**
 * Fetch pack detail by id via RPC get_pack_by_id (pack fields, samples, similar_packs).
 * Returns null when pack is not found or on error.
 */
export async function getPackById(packId: string): Promise<PackDetail | null> {
  const { data, error } = await supabase.rpc('get_pack_by_id', {
    p_pack_id: packId,
  });

  if (error) {
    console.error('Error fetching pack by id:', error);
    return null;
  }

  if (!data) return null;

  return data as PackDetail;
}

/**
 * Fetch all packs with creator, category, genres, and sample count via RPC get_all_packs.
 * Supports optional filters and sort; all params default to "no filter" / newest.
 * Auth: authenticated or service_role.
 */
export interface GetAllPacksOptions {
  /** Free-text search on pack name, creator name */
  p_search?: string | null;
  /** One of: newest, oldest, popular, name-az, name-za */
  p_sort?: string | null;
  /** Genre names (array overlap) */
  p_genres?: string[] | null;
  /** Tags/keywords (array overlap) */
  p_keywords?: string[] | null;
  /** all | premium | free */
  p_access?: string | null;
  /** Reserved (all) */
  p_license?: string | null;
  /** Creator names */
  p_creators?: string[] | null;
  /** all | 24h | 7d | 30d */
  p_released?: string | null;
  p_limit?: number | null;
  p_offset?: number | null;
}

export async function getAllPacks(options?: GetAllPacksOptions): Promise<PackRow[]> {
  const {
    p_search = null,
    p_sort = 'newest',
    p_genres = null,
    p_keywords = null,
    p_access = 'all',
    p_license = 'all',
    p_creators = null,
    p_released = 'all',
    p_limit = null,
    p_offset = 0,
  } = options ?? {};

  const { data, error } = await supabase.rpc('get_all_packs', {
    p_search: p_search?.trim() || null,
    p_sort: p_sort || 'newest',
    p_genres: p_genres?.length ? p_genres : null,
    p_keywords: p_keywords?.length ? p_keywords : null,
    p_access: p_access || 'all',
    p_license: p_license || 'all',
    p_creators: p_creators?.length ? p_creators : null,
    p_released: p_released || 'all',
    p_limit: p_limit ?? null,
    p_offset: p_offset ?? 0,
  });

  if (error) {
    console.error('Error fetching packs:', error);
    return [];
  }

  return Array.isArray(data) ? (data as PackRow[]) : [];
}

/**
 * Row shape returned by get_featured_packs RPC.
 */
export interface FeaturedPackRow {
  id: string;
  name: string;
  description: string | null;
  creator_id: string | null;
  creator_name: string;
  cover_url: string | null;
  category_name: string | null;
  tags: string[] | null;
  is_premium: boolean | null;
  status: string;
  download_count: number | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
  samples_count: number;
}

/**
 * Fetch featured packs via Supabase RPC get_featured_packs.
 * Returns empty array on error or if RPC is not deployed.
 */
export async function getFeaturedPacks(): Promise<FeaturedPackRow[]> {
  const { data, error } = await supabase.rpc('get_featured_packs');

  if (error) {
    console.error('Error fetching featured packs:', error);
    return [];
  }

  return Array.isArray(data) ? (data as FeaturedPackRow[]) : [];
}

/** Liked pack anchor returned by get_similar_packs_by_liked_pack. */
export interface LikedPackRef {
  id: string;
  name: string;
}

/** RPC get_similar_packs_by_liked_pack — similar packs for Discover "Because you liked". */
export interface SimilarPacksByLikedResult {
  liked_pack: LikedPackRef | null;
  similarities: PackRow[];
}

/**
 * Similar packs based on a pack the user liked (or most recent liked pack when p_pack_id omitted).
 * RPC: get_similar_packs_by_liked_pack
 */
export async function getSimilarPacksByLikedPack(options?: {
  p_pack_id?: string;
  p_limit?: number;
}): Promise<SimilarPacksByLikedResult | null> {
  const p_limit = options?.p_limit ?? 6;
  const params: { p_limit: number; p_pack_id?: string } = { p_limit };
  if (options?.p_pack_id) params.p_pack_id = options.p_pack_id;

  const { data, error } = await supabase.rpc('get_similar_packs_by_liked_pack', params);

  if (error) {
    console.error('Error fetching similar packs by liked pack:', error);
    return null;
  }

  if (data == null || typeof data !== 'object') return null;

  const row = data as Record<string, unknown>;
  const rawLiked = row.liked_pack;
  const liked_pack =
    rawLiked &&
    typeof rawLiked === 'object' &&
    'id' in rawLiked &&
    'name' in rawLiked &&
    typeof (rawLiked as { id: unknown }).id === 'string' &&
    typeof (rawLiked as { name: unknown }).name === 'string'
      ? { id: (rawLiked as { id: string }).id, name: (rawLiked as { name: string }).name }
      : null;

  const sims = row.similarities;
  const similarities = Array.isArray(sims) ? (sims as PackRow[]) : [];

  return { liked_pack, similarities };
}
