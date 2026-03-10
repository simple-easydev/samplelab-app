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
 * Fetch a single creator by id with pack and sample counts.
 * Uses get_creators_with_counts and finds by id (consider a dedicated get_creator_by_id RPC for scale).
 */
export async function getCreatorById(id: string): Promise<CreatorWithCounts | null> {
  const list = await getCreatorsWithCounts({ p_limit: 1000 });
  return list.find((c) => c.id === id) ?? null;
}
