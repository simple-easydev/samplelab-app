import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSampleMetadata, formatDurationSeconds } from '@/lib/supabase/samples';
import type { SampleItem } from '@/lib/supabase/samples';
import type { PackDetailSample } from '@/lib/supabase/packs';
import type { CreatorDetailSample } from '@/lib/supabase/creators';
import { type SampleRowItem } from '@/components/SampleRow';

/** Input from get_all_samples (SampleItem) or from get_pack_by_id.samples with creator_name + pack_name added. */
export type SampleRowItemInput = SampleItem | (PackDetailSample & { creator_name: string; pack_name: string });

function hasMetadata(sample: SampleRowItemInput): sample is SampleItem {
  return 'metadata' in sample && (sample as SampleItem).metadata != null;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function mapAllSampleToRowItem(sample: SampleRowItemInput): SampleRowItem {
  const tags: string[] = [];
  if ('genre' in sample && sample.genre) tags.push(sample.genre);
  if ('pack_name' in sample && sample.pack_name) tags.push(sample.pack_name);
  if (sample.has_stems) tags.push('Stems');
  if (sample.type) tags.push(sample.type);

  const duration = hasMetadata(sample)
    ? (getSampleMetadata(sample) ? formatDurationSeconds(getSampleMetadata(sample)!.duration_seconds) : '—')
    : ('length' in sample && sample.length ? sample.length : '—');

  const waveformBars = hasMetadata(sample) ? getSampleMetadata(sample)?.bars : undefined;

  return {
    id: sample.id,
    name: sample.name,
    creator: sample.creator_name,
    duration,
    waveformBars,
    audioUrl: sample.preview_audio_url ?? undefined,
    tags,
    royaltyFree: true,
    premium: false,
    bpm: sample.bpm ?? undefined,
    key: sample.key ?? undefined,
    imageUrl: 'thumbnail_url' in sample ? sample.thumbnail_url ?? undefined : undefined,
  };
}

/** Convert pack detail sample + context to SampleItem for SampleRow. */
export function packDetailSampleToSampleItem(
  s: PackDetailSample,
  creator_name: string,
  pack_name: string
): SampleItem {
  return {
    id: s.id,
    name: s.name,
    pack_id: s.pack_id,
    pack_name,
    creator_name,
    audio_url: s.preview_audio_url,
    thumbnail_url: null,
    genre: null,
    bpm: s.bpm,
    key: s.key,
    type: s.type,
    download_count: s.download_count ?? 0,
    status: s.status,
    has_stems: s.has_stems ?? false,
    stems_count: 0,
    created_at: s.created_at ?? '',
    metadata: s.metadata,
  };
}

function parseLengthToSeconds(length: string): number {
  const parts = length.trim().split(':').map(Number);
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) return parts[0] * 60 + parts[1];
  return 0;
}

/** Convert creator detail sample + context to SampleItem for SampleRow. */
export function creatorDetailSampleToSampleItem(s: CreatorDetailSample, creator_name: string): SampleItem {
  return {
    id: s.id,
    name: s.name,
    pack_id: s.pack_id,
    pack_name: '',
    creator_name,
    audio_url: s.audio_url,
    thumbnail_url: null,
    genre: null,
    bpm: s.bpm,
    key: s.key,
    type: s.type,
    download_count: s.download_count ?? 0,
    status: s.status,
    has_stems: s.has_stems ?? false,
    stems_count: 0,
    created_at: s.created_at ?? '',
    metadata: s.length ? { bars: [], duration_seconds: parseLengthToSeconds(s.length) } : undefined,
  };
}