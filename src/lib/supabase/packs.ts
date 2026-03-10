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
