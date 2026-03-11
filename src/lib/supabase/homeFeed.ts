import { supabase } from './client';
import { CreatorWithCounts } from './creators';
import { SampleItem } from './samples';


/**
 * Response shape from get_home_feed RPC.
 */
export interface HomeFeedData {
  trending_samples: SampleItem[];
  new_releases: SampleItem[];
  top_creators: CreatorWithCounts[];
}

/**
 * Fetch home feed (trending samples, new releases, top creators) via Supabase RPC get_home_feed.
 * Returns null on error; arrays may be empty if the RPC is not yet deployed.
 */
export async function getHomeFeed(): Promise<HomeFeedData | null> {
  const { data, error } = await supabase.rpc('get_home_feed');

  if (error) {
    console.error('Error fetching home feed:', error);
    return null;
  }

  if (!data || typeof data !== 'object') {
    return null;
  }

  const raw = data as Record<string, unknown>;
  return {
    trending_samples: Array.isArray(raw.trending_samples) ? (raw.trending_samples as SampleItem[]) : [],
    new_releases: Array.isArray(raw.new_releases) ? (raw.new_releases as SampleItem[]) : [],
    top_creators: Array.isArray(raw.top_creators) ? (raw.top_creators as CreatorWithCounts[]) : [],
  };
}
