import { supabase } from './client';

/**
 * Audio metadata returned per sample (waveform bars and duration).
 */
export interface SampleMetadata {
  bars: number[];
  duration_seconds: number;
}

/**
 * Sample row returned by RPC get_all_samples (admin library Samples tab).
 * Matches API: id, name, pack_name, creator_name, genre, stems_count, metadata, etc.
 */
export interface SampleItem {
  id: string;
  name: string;
  pack_id: string;
  creator_id?: string | null;
  pack_name: string;
  creator_name: string;
  /** Credits required to download the base sample (WAV). */
  credit_cost?: number | null;
  /** Legacy field (may be absent after RPC change). */
  audio_url: string | null;
  /** New field returned by RPC `get_all_samples` (used for previews). */
  preview_audio_url?: string | null;
  thumbnail_url: string | null;
  genre: string | null;
  bpm: number | null;
  key: string | null;
  type: string;
  download_count: number;
  status: string;
  has_stems: boolean;
  stems_count: number;
  created_at: string;
  /** Waveform bars and duration; may be JSON string from DB. */
  metadata?: SampleMetadata | string | null;
}

/**
 * Options for get_all_samples RPC (all optional; defaults = no filter / newest).
 */
export interface GetAllSamplesOptions {
  p_search?: string | null;
  p_sort?: string | null;
  p_genres?: string[] | null;
  p_keywords?: string[] | null;
  p_instrument?: string | null;
  p_type?: string | null;
  p_stems?: string | null;
  p_keys?: string[] | null;
  p_key_quality?: string | null;
  p_bpm_min?: number | null;
  p_bpm_max?: number | null;
  p_bpm_exact?: number | null;
  p_limit?: number | null;
  p_offset?: number | null;
}

/**
 * Fetch all samples with pack, creator, genre, and stem count via RPC get_all_samples.
 * Supports optional filters and sort; all params default to "no filter" / newest.
 * Auth: authenticated or service_role.
 */
export async function getAllSamples(options?: GetAllSamplesOptions): Promise<SampleItem[]> {
  const {
    p_search = null,
    p_sort = 'newest',
    p_genres = null,
    p_keywords = null,
    p_instrument = 'all',
    p_type = 'all',
    p_stems = 'all',
    p_keys = null,
    p_key_quality = 'all',
    p_bpm_min = null,
    p_bpm_max = null,
    p_bpm_exact = null,
    p_limit = null,
    p_offset = 0,
  } = options ?? {};

  const { data, error } = await supabase.rpc('get_all_samples', {
    p_search: p_search?.trim() || null,
    p_sort: p_sort || 'newest',
    p_genres: p_genres?.length ? p_genres : null,
    p_keywords: p_keywords?.length ? p_keywords : null,
    p_instrument: p_instrument || 'all',
    p_type: p_type || 'all',
    p_stems: p_stems || 'all',
    p_keys: p_keys?.length ? p_keys : null,
    p_key_quality: p_key_quality || 'all',
    p_bpm_min: p_bpm_min ?? null,
    p_bpm_max: p_bpm_max ?? null,
    p_bpm_exact: p_bpm_exact ?? null,
    p_limit: p_limit ?? null,
    p_offset: p_offset ?? 0,
  });

  if (error) {
    console.error('Error fetching samples:', error);
    return [];
  }

  // RPC `get_all_samples` now returns `preview_audio_url` instead of `audio_url`.
  // Normalize to keep the rest of the UI using `sample.audio_url`.
  if (!Array.isArray(data)) return [];
  return (data as Array<Record<string, unknown>>).map((row) => {
    const audioUrl = (row.audio_url as string | null | undefined) ?? (row.preview_audio_url as string | null | undefined) ?? null;
    return {
      ...(row as Record<string, unknown>),
      audio_url: audioUrl,
    } as SampleItem;
  });
}

export interface SimilarSampleItem extends SampleItem {
  seed_sample_id: string;
  seed_sample_name: string;
}

/**
 * Fetch similar samples based on the user's most recently downloaded sample.
 * RPC: get_similar_samples_by_downloaded_sample
 */
export async function getSimilarSamplesByDownloadedSample(options?: {
  p_limit?: number;
}): Promise<SimilarSampleItem[]> {
  const p_limit = options?.p_limit ?? 24;

  const { data, error } = await supabase.rpc(
    'get_similar_samples_by_downloaded_sample',
    { p_limit }
  );

  if (error) {
    console.error('Error fetching similar samples:', error);
    return [];
  }

  if (!Array.isArray(data)) return [];
  return (data as Array<Record<string, unknown>>).map((row) => {
    const audioUrl =
      (row.audio_url as string | null | undefined) ??
      (row.preview_audio_url as string | null | undefined) ??
      null;
    return {
      ...(row as Record<string, unknown>),
      audio_url: audioUrl,
    } as SimilarSampleItem;
  });
}

/** Parse metadata from row (handles JSON string from DB). */
export function getSampleMetadata(row: SampleItem): SampleMetadata | null {
  const raw = row.metadata;
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as SampleMetadata;
      return Array.isArray(parsed?.bars) && typeof parsed?.duration_seconds === 'number'
        ? parsed
        : null;
    } catch {
      return null;
    }
  }
  return Array.isArray(raw.bars) && typeof raw.duration_seconds === 'number' ? raw : null;
}

/** Format duration in seconds to "M:SS" (e.g. 42.5 → "0:42"). */
export function formatDurationSeconds(seconds: number): string {
  const secs = Math.floor(seconds);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
