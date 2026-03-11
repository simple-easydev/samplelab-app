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
 * Auth: authenticated or service_role.
 */
export async function getAllPacks(): Promise<PackRow[]> {
  const { data, error } = await supabase.rpc('get_all_packs');

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
