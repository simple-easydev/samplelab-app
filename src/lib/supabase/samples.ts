import { supabase } from './client';

/**
 * Sample row returned by RPC get_all_samples (admin library Samples tab).
 * Matches API: id, name, pack_name, creator_name, genre, stems_count, etc.
 */
export interface SampleRowAll {
  id: string;
  name: string;
  pack_id: string;
  pack_name: string;
  creator_name: string;
  genre: string | null;
  bpm: number | null;
  key: string | null;
  type: string;
  download_count: number;
  status: string;
  has_stems: boolean;
  stems_count: number;
  created_at: string;
}

/**
 * Fetch all samples with pack, creator, genre, and stem count via RPC get_all_samples.
 * Auth: authenticated or service_role.
 */
export async function getAllSamples(): Promise<SampleRowAll[]> {
  const { data, error } = await supabase.rpc('get_all_samples');

  if (error) {
    console.error('Error fetching samples:', error);
    return [];
  }

  return Array.isArray(data) ? (data as SampleRowAll[]) : [];
}
