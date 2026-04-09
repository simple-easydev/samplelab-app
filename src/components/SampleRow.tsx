import { useEffect, useMemo, useState } from 'react';
import { Crown, Play, Pause, Heart, Download, MoreVertical, FolderOpen, User, Share2, BarChart2, X, Repeat, Loader2, Clock, Folder } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from '@/components/ui/drawer';
import { getSampleMetadata, formatDurationSeconds, type SampleItem } from '@/lib/supabase/samples';
import {
  requestSampleDownloadWithRetry,
  SampleDownloadError,
  getSampleDownloadErrorMessage,
  triggerSignedDownload,
} from '@/lib/supabase/sampleDownload';
import { useCredits } from '@/contexts/CreditsContext';
import { useNavigate } from 'react-router-dom';
import { useAudioPreviewPlayer } from '@/contexts/AudioPreviewPlayerContext';
import { getBillingInfo } from '@/lib/supabase/subscriptions';
import {
  isSampleLiked,
  likeSample,
  unlikeSample,
} from '@/lib/supabase/likes';
import { supabase } from '@/lib/supabase/client';

/**
 * @deprecated Use SampleItem from getAllSamples and pass as `sample` prop instead.
 */
export interface SampleRowItem {
  id: string;
  name: string;
  creator: string;
  duration: string;
  /** Play progress 0–1 (e.g. 0.35 = 35% played). Used by SoundWave. */
  progress?: number;
  /** Waveform bar heights 0–1 from sample metadata; when set, used for visualization. */
  waveformBars?: number[];
  /** First row: e.g. genre, type (Loop), Stems */
  tags: string[];
  /** Second row: show "Royalty-Free" */
  royaltyFree?: boolean;
  /** Second row: show premium crown badge */
  premium?: boolean;
  bpm?: number;
  key?: string;
  imageUrl?: string | null;
  /** Optional audio URL for playback. */
  audioUrl?: string | null;
}

/** Derived display values from SampleItem for use inside SampleRow. */
function sampleToDisplay(sample: SampleItem) {
  const meta = getSampleMetadata(sample);
  const durationStr = meta ? formatDurationSeconds(meta.duration_seconds) : '0:00';
  const waveformBars = meta?.bars && meta.bars.length > 0 ? meta.bars : undefined;
  const tags: string[] = [];
  if (sample.genre) tags.push(sample.genre);
  if (sample.type) tags.push(sample.type);
  if (sample.has_stems) tags.push('Stems');
  return {
    id: sample.id,
    name: sample.name,
    creator: sample.creator_name,
    duration: durationStr,
    waveformBars,
    tags,
    imageUrl: sample.thumbnail_url ?? undefined,
    audioUrl: sample.preview_audio_url ?? sample.audio_url ?? undefined,
    bpm: sample.bpm ?? undefined,
    key: sample.key ?? undefined,
    royaltyFree: true as const,
    premium: false as const,
  };
}

const BAR_COUNT = 48;

function generateWaveformData(count: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    const norm = i / count;
    const base = Math.sin(norm * Math.PI) * 0.5 + 0.3;
    const d1 = Math.sin(norm * 14 + 0.5) * 0.2;
    const d2 = Math.cos(norm * 23 + 1.2) * 0.15;
    const d3 = Math.sin(norm * 7 + 2.8) * 0.1;
    const d4 = Math.cos(norm * 31 + 0.3) * 0.12;
    const quietStart = Math.min(1, norm * 4);
    const quietEnd = Math.min(1, (1 - norm) * 4);
    const val = Math.max(0.1, (base + d1 + d2 + d3 + d4) * quietStart * quietEnd);
    data.push(Math.min(1, val));
  }
  return data;
}

const WAVEFORM = generateWaveformData(BAR_COUNT);

function parseDurationToSeconds(duration: string): number {
  const parts = duration.trim().split(':').map(Number);
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 34;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export type SoundWaveTimeDisplay = 'passed' | 'remaining';

export interface SoundWaveProps {
  /** Duration string e.g. "0:34" */
  duration: string;
  /** Fixed play progress from 0 to 1 (e.g. 0.35 = 35% played). Waveform and time use this value. */
  progress?: number;
  /** Bar heights 0–1 from sample metadata; when provided, used for waveform instead of placeholder. */
  waveformBars?: number[];
  /** Show elapsed time (e.g. "0:12") or remaining time (e.g. "0:22"). Default "remaining". */
  timeDisplay?: SoundWaveTimeDisplay;
  /** When true, waveform bars use darker colors (hover/active state). */
  emphasized?: boolean;
  className?: string;
}

function SoundWave({
  duration,
  progress: progressProp = 0,
  waveformBars,
  timeDisplay = 'remaining',
  emphasized = false,
  className,
}: SoundWaveProps) {
  const durationSec = parseDurationToSeconds(duration);
  const bars = waveformBars && waveformBars.length > 0 ? waveformBars : WAVEFORM;
  const barCount = bars.length;

  const progress = Math.max(0, Math.min(1, progressProp));
  const elapsed = progress * durationSec;
  const effectiveProgress = durationSec > 0 ? elapsed / durationSec : 0;
  const playedIndex = Math.floor(effectiveProgress * barCount);

  const displayTime =
    timeDisplay === 'passed'
      ? formatTime(Math.min(elapsed, durationSec))
      : formatTime(Math.max(0, durationSec - elapsed));

  const playedColor = emphasized ? '#161410' : '#d6ceb8';
  const unplayedColor = emphasized ? 'rgba(22, 20, 16, 0.35)' : 'rgba(214, 206, 184, 0.35)';

  return (
    <div
      className={[className, 'min-w-0 overflow-hidden'].filter(Boolean).join(' ')}
      role="group"
      aria-label="Waveform"
    >
      <div className="flex items-center gap-2 h-10 min-w-0 w-full">
        <div
          className="flex items-center flex-1 h-full gap-0.5 cursor-pointer min-w-0 overflow-hidden"
          style={{ minHeight: '40px' }}
        >
          {bars.map((val, i) => {
            const played = i <= playedIndex;
            return (
              <div
                key={i}
                className="flex-1 min-w-0 max-w-[4.5px] rounded-full transition-colors duration-150 ease-out border-0 cursor-pointer p-0"
                style={{
                  height: `${val * 100}%`,
                  background: played ? playedColor : unplayedColor,
                }}
                aria-hidden
              />
            );
          })}
        </div>
        <span
          className="shrink-0 text-[#5e584b] text-xs tabular-nums min-w-[28px] text-right"
        >
          {displayTime}
        </span>
      </div>
    </div>
  );
}

export interface SampleRowProps {
  /** Sample from getAllSamples (preferred). When set, display is derived from this. */
  sample?: SampleItem;
  /** @deprecated Use `sample` from getAllSamples instead. Legacy row data when sample is not provided. */
  item?: SampleRowItem;
  /** When "compact", only thumbnail + name + creator (and optional rank) are shown. Default "full". */
  variant?: 'full' | 'compact';
  /** Optional rank number; shown as leading column when variant is "compact". */
  rank?: number;
  /** When true, show filled heart and "Remove from favorites" (e.g. on Favorites page). */
  isFavorited?: boolean;
}

export function SampleRow({ sample, item, variant = 'full', rank, isFavorited = false }: SampleRowProps) {
  const navigate = useNavigate();
  const { credits, refreshCredits } = useCredits();
  const row = sample ? sampleToDisplay(sample) : item!;
  const sampleId = sample?.id ?? item?.id;
  const [liked, setLiked] = useState(isFavorited);
  const [likeBusy, setLikeBusy] = useState(false);
  const [fullRowHovered, setFullRowHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [renewDateLabel, setRenewDateLabel] = useState<string | null>(null);

  const {
    activePreviewKind,
    activePreviewId,
    isPlaying: playerIsPlaying,
    progress01,
    playSamplePreview,
    togglePlayPause,
  } = useAudioPreviewPlayer();

  const isSamplePlaying = activePreviewKind === 'sample' && !!sampleId && activePreviewId === sampleId;
  const audioProgress = isSamplePlaying ? progress01 : 0;
  const isPlaying = isSamplePlaying && playerIsPlaying;

  const packName = sample?.pack_name ?? null;

  const wavCreditCost = sample?.credit_cost ?? null;
  const stemsCreditCost = sample?.has_stems ? (wavCreditCost != null ? wavCreditCost + 4 : null) : null;

  const wavCreditLabel = wavCreditCost != null ? `${wavCreditCost} credit${wavCreditCost === 1 ? '' : 's'}` : '— credits';
  const stemsCreditLabel =
    stemsCreditCost != null ? `${stemsCreditCost} credit${stemsCreditCost === 1 ? '' : 's'}` : '— credits';

  const creditsLabel = useMemo(() => {
    if (credits == null) return '—';
    return String(credits);
  }, [credits]);

  useEffect(() => {
    if (!downloadModalOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const { subscription } = await getBillingInfo();
        const iso = subscription?.current_period_end;
        if (!iso) {
          if (!cancelled) setRenewDateLabel(null);
          return;
        }
        const dt = new Date(iso);
        const label = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        if (!cancelled) setRenewDateLabel(label);
      } catch {
        if (!cancelled) setRenewDateLabel(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [downloadModalOpen]);

  useEffect(() => {
    if (!sampleId) return;
    let cancelled = false;
    isSampleLiked(sampleId).then((v) => {
      if (!cancelled) setLiked(v);
    });
    return () => {
      cancelled = true;
    };
  }, [sampleId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sampleId || likeBusy) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Sign in to save favorites.');
      return;
    }
    setLikeBusy(true);
    const next = !liked;
    setLiked(next);
    const res = next ? await likeSample(sampleId) : await unlikeSample(sampleId);
    if ('error' in res) {
      setLiked(!next);
      toast.error(res.error);
    }
    setLikeBusy(false);
  };

  const handleOpenDownloadModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sampleId) return;
    setDownloadModalOpen(true);
  };

  const handleDownloadFull = async (
    e: React.MouseEvent,
    options?: { includeStemsZip?: boolean }
  ) => {
    e.stopPropagation();
    if (!sampleId || downloadLoading) return;
    setDownloadLoading(true);
    try {
      const result = await requestSampleDownloadWithRetry(sampleId, options);
      await triggerSignedDownload(result.signedUrl, result.filename);
      const used =
        result.creditsCharged > 0
          ? `${result.creditsCharged} credit${result.creditsCharged === 1 ? '' : 's'} used. `
          : '';
      try {
        const credits = await refreshCredits();
        toast.success('Download complete', {
          description: `${used}${credits} credits remaining.`,
        });
      } catch {
        try {
          await refreshCredits();
        } catch {
          /* ignore */
        }
        toast.success('Download complete', {
          description:
            result.creditsCharged > 0
              ? `${result.creditsCharged} credit${result.creditsCharged === 1 ? '' : 's'} used. Refreshing credits…`
              : 'Refreshing credits…',
        });
      }
    } catch (err) {
      if (err instanceof SampleDownloadError) {
        toast.error(getSampleDownloadErrorMessage(err.code));
      } else {
        toast.error('Download failed. Please try again.');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (!row.audioUrl || !sampleId) return;
    if (isSamplePlaying) {
      togglePlayPause();
      return;
    }

    void playSamplePreview({
      kind: 'sample',
      id: sampleId,
      name: row.name,
      creatorName: row.creator,
      coverUrl: row.imageUrl ?? undefined,
      packId: sample?.pack_id ?? null,
      creatorId: sample?.creator_id ?? null,
      previewAudioUrl: row.audioUrl,
      durationLabel: row.duration,
      bpm: sample?.bpm ?? null,
      key: sample?.key ?? null,
    });
  };

  const handleViewPack = () => {
    const packId = sample?.pack_id;
    if (!packId) return;
    navigate(`/dashboard/packs/${packId}`);
  };

  const handleViewCreator = () => {
    const creatorId = sample?.creator_id;
    if (!creatorId) return;
    navigate(`/dashboard/creators/${creatorId}`);
  };

  if (variant === 'compact') {
    return (
      <div className="group bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex gap-4 items-center p-4 w-full transition-[background-color] duration-200 hover:bg-[#FFFBF0]">
        {rank != null && (
          <span className="text-[#161410] text-base font-medium leading-6 text-center w-4 shrink-0">
            {rank}
          </span>
        )}
        {/* Thumbnail with hover overlay + play button (Figma 804-32679) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePlay();
          }}
          className="shrink-0"
        >
          <div className="relative size-14 rounded-sm overflow-hidden border border-[#e8e2d2] bg-white">
            {row.imageUrl ? (
              <img
                src={row.imageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
            )}
            <div
              className={`absolute inset-0 bg-[#161410] transition-opacity duration-200 ${isPlaying ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}
              aria-hidden
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="flex size-10 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                {isPlaying ? (
                  <Pause className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                ) : (
                  <Play className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                )}
              </div>
            </div>
          </div>
        </button>
        <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
          <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
            {row.name}
          </p>
          <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
            {row.creator}
          </p>
        </div>
        {/* Like + Download icons (visible on hover) */}
        <div className="flex gap-1 items-center shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={likeBusy}
            className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50"
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={liked}
          >
            <Heart className={`size-5 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenDownloadModal}
            disabled={!sampleId}
            className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Download"
          >
            <Download className="size-5" />
          </button>
        </div>

        <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
          <DialogContent
            showCloseButton={false}
            className="p-0 bg-[#fffbf0] border-0 rounded-lg shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)] max-w-[720px]"
          >
            <div className="flex items-center gap-4 w-full border-b border-[#e8e2d2] px-6 py-4">
              <div className="flex items-center gap-4 min-w-0 flex-1 text-xs leading-4 tracking-[0.2px]">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[#7f7766]">Credits remaining:</span>
                  <span className="text-[#5e584b] font-medium">{creditsLabel}</span>
                </div>
                <span className="w-px h-4 bg-[#d6ceb8] shrink-0" aria-hidden />
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[#7f7766]">Renews on</span>
                  <span className="text-[#5e584b] font-medium">{renewDateLabel ?? '—'}</span>
                </div>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  className="size-6 flex items-center justify-center rounded-full text-[#5e584b] hover:bg-[#e8e2d2] hover:text-[#161410] transition-colors"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </DialogClose>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                  className="relative shrink-0 size-[196px] rounded-sm overflow-hidden bg-[#dde1e6]"
                  aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                >
                  {row.imageUrl ? (
                    <img src={row.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[#dde1e6]" aria-hidden />
                  )}
                  <div className="absolute inset-0 bg-[#161410] opacity-50" aria-hidden />

                  {row.premium && (
                    <div className="absolute right-2 top-2 h-5 px-1.5 rounded-md bg-[#f3c16c] border border-[#eaaa3e] inline-flex items-center justify-center">
                      <span className="text-[10px] font-medium leading-3 tracking-[0.3px] text-[#161410]">
                        Premium
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                      {isPlaying ? (
                        <Pause className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                      ) : (
                        <Play className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0 pl-0.5" aria-hidden />
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex flex-col gap-4 w-full min-w-0">
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="text-[#161410] text-[18px] font-bold leading-7 truncate">
                      {row.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs leading-4 tracking-[0.2px] text-[#5e584b]">
                      <div className="inline-flex items-center gap-1">
                        <Clock className="size-4 shrink-0" aria-hidden />
                        <span className="tabular-nums">{row.duration}</span>
                      </div>
                      {packName && (
                        <div className="inline-flex items-center gap-1 min-w-0">
                          <Folder className="size-4 shrink-0" aria-hidden />
                          <span className="truncate">{packName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadFull(e, { includeStemsZip: false })}
                      disabled={!sampleId || downloadLoading}
                      aria-busy={downloadLoading}
                      className="w-full h-[60px] px-4 rounded-sm bg-[#161410] text-[#fffbf0] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                    >
                      {downloadLoading ? (
                        <Loader2 className="size-6 animate-spin shrink-0" aria-hidden />
                      ) : (
                        <Download className="size-6 shrink-0" aria-hidden />
                      )}
                      <div className="flex flex-col items-start leading-none min-w-0">
                        <span className="text-sm font-medium leading-5 tracking-[0.1px] truncate w-full">
                          Download sample (WAV)
                        </span>
                        <span className="text-xs leading-4 tracking-[0.2px] text-[#d6ceb8]">
                          {wavCreditLabel}
                        </span>
                      </div>
                    </button>

                    {sample?.has_stems && (
                      <button
                        type="button"
                        onClick={(e) => handleDownloadFull(e, { includeStemsZip: true })}
                        disabled={!sampleId || downloadLoading}
                        aria-busy={downloadLoading}
                        className="w-full h-[60px] px-4 rounded-sm bg-[#161410] text-[#fffbf0] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                      >
                        {downloadLoading ? (
                          <Loader2 className="size-6 animate-spin shrink-0" aria-hidden />
                        ) : (
                          <Download className="size-6 shrink-0" aria-hidden />
                        )}
                        <div className="flex flex-col items-start leading-none min-w-0">
                          <span className="text-sm font-medium leading-5 tracking-[0.1px] truncate w-full">
                            Download sample (WAV + STEMS)
                          </span>
                          <span className="text-xs leading-4 tracking-[0.2px] text-[#d6ceb8]">
                            {stemsCreditLabel}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
    <div
      className="group bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex flex-col items-stretch p-4 w-full transition-[background-color] duration-200 hover:bg-[#FFFBF0]"
      onMouseEnter={() => setFullRowHovered(true)}
      onMouseLeave={() => setFullRowHovered(false)}
    >
      <div
        className="grid w-full gap-4 items-center grid-cols-2 md:grid-cols-[minmax(0,280px)_minmax(260px,340px)_minmax(160px,1fr)_140px]"
      >
        {/* Column 1: Thumbnail (with hover play overlay) + sample name + creator – Figma 804-36336 */}
        <div className="flex gap-4 h-14 items-center min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            className="shrink-0"
          >
            <div className="relative size-14 rounded-sm overflow-hidden border border-[#e8e2d2] bg-white">
              {row.imageUrl ? (
                <img
                  src={row.imageUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
              )}
              <div
                className={`absolute inset-0 bg-[#161410] transition-opacity duration-200 ${isPlaying ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}
                aria-hidden
              />
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="flex size-10 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                  {isPlaying ? (
                    <Pause className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                  ) : (
                    <Play className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                  )}
                </div>
              </div>
            </div>
          </button>
          <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
            <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
              {row.name}
            </p>
            <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
              {row.creator}
            </p>
          </div>
        </div>

        {/* Column 2: Waveform + time (darker on hover) — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 min-w-0 w-full">
          <SoundWave
            duration={row.duration}
            progress={audioProgress}
            waveformBars={row.waveformBars}
            timeDisplay="remaining"
            emphasized={fullRowHovered}
            className="h-10 shrink-0 flex-1 min-w-0"
          />
        </div>

        {/* Column 3: Tags — hidden on mobile */}
        <div className="hidden md:flex flex-col gap-2 items-start justify-center min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            {row.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {row.royaltyFree !== false && (
              <span className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                Royalty-Free
              </span>
            )}
            {row.premium && (
              <span className="bg-[#f3c16c] border border-[#eaaa3e] rounded-md h-5 px-1.5 inline-flex items-center justify-center gap-0.5 text-[#161410]">
                <Crown className="size-3 shrink-0" aria-hidden />
              </span>
            )}
          </div>
        </div>

        {/* Column 4: BPM • Key + action icons (visible on hover) */}
        <div className="flex items-center gap-3 justify-end min-w-[140px]">
          {row.bpm != null && (
            <div className="hidden md:flex gap-2 items-center shrink-0">
              <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                {row.bpm} BPM
              </span>
              {row.key && (
                <>
                  <span className="text-[#5e584b] size-1 rounded-full bg-[#5e584b] shrink-0" aria-hidden />
                  <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                    {row.key}
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex gap-1 items-center shrink-0 opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={likeBusy}
              className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50"
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={liked}
            >
              <Heart className={`size-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleOpenDownloadModal}
              disabled={!sampleId}
              className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Download"
            >
              <Download className="size-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                aria-label="More options"
              >
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors"
                >
                  <MoreVertical className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-[180px] rounded py-1 border border-[#d6ceb8] bg-white shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)]"
              >
                <DropdownMenuItem
                  className="flex md:hidden h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={() => setDetailsOpen(true)}
                >
                  <BarChart2 className="size-5 shrink-0" aria-hidden />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleViewPack();
                  }}
                >
                  <FolderOpen className="size-5 shrink-0" aria-hidden />
                  View pack
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleViewCreator();
                  }}
                >
                  <User className="size-5 shrink-0" aria-hidden />
                  View creator
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Share2 className="size-5 shrink-0" aria-hidden />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="p-0 bg-[#fffbf0] border-0 rounded-lg shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)] w-fit max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center gap-4 w-full border-b border-[#e8e2d2] px-6 py-4">
          <div className="flex items-center gap-4 min-w-0 flex-1 text-xs leading-4 tracking-[0.2px]">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[#7f7766]">Credits remaining:</span>
              <span className="text-[#5e584b] font-medium">{creditsLabel}</span>
            </div>
            <span className="w-px h-4 bg-[#d6ceb8] shrink-0" aria-hidden />
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[#7f7766]">Renews on</span>
              <span className="text-[#5e584b] font-medium">{renewDateLabel ?? '—'}</span>
            </div>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              className="size-6 flex items-center justify-center rounded-full text-[#5e584b] hover:bg-[#e8e2d2] hover:text-[#161410] transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </DialogClose>
        </div>

        <div className="p-6 min-w-0">
          <div className="flex min-w-0 w-full flex-col gap-6 items-start sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="relative shrink-0 size-[196px] rounded-sm overflow-hidden bg-[#dde1e6]"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            >
              {row.imageUrl ? (
                <img src={row.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[#dde1e6]" aria-hidden />
              )}
              <div className="absolute inset-0 bg-[#161410] opacity-50" aria-hidden />

              {row.premium && (
                <div className="absolute right-2 top-2 h-5 px-1.5 rounded-md bg-[#f3c16c] border border-[#eaaa3e] inline-flex items-center justify-center">
                  <span className="text-[10px] font-medium leading-3 tracking-[0.3px] text-[#161410]">
                    Premium
                  </span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                  {isPlaying ? (
                    <Pause className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                  ) : (
                    <Play className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0 pl-0.5" aria-hidden />
                  )}
                </div>
              </div>
            </button>

            <div className="flex min-w-0 w-full flex-col gap-4 sm:w-auto sm:flex-1">
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-[#161410] text-[18px] font-bold leading-7 truncate">
                  {row.name}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs leading-4 tracking-[0.2px] text-[#5e584b]">
                  <div className="inline-flex items-center gap-1">
                    <Clock className="size-4 shrink-0" aria-hidden />
                    <span className="tabular-nums">{row.duration}</span>
                  </div>
                  {packName && (
                    <div className="inline-flex items-center gap-1 min-w-0">
                      <Folder className="size-4 shrink-0" aria-hidden />
                      <span className="truncate">{packName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={(e) => handleDownloadFull(e, { includeStemsZip: false })}
                  disabled={!sampleId || downloadLoading}
                  aria-busy={downloadLoading}
                  className="w-full min-h-[60px] px-4 py-3 rounded-sm bg-[#161410] text-[#fffbf0] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                >
                  {downloadLoading ? (
                    <Loader2 className="size-6 animate-spin shrink-0" aria-hidden />
                  ) : (
                    <Download className="size-6 shrink-0" aria-hidden />
                  )}
                  <div className="flex min-w-0 flex-col items-start leading-none">
                    <span className="w-full text-left text-sm font-medium leading-5 tracking-[0.1px] wrap-break-word">
                      Download sample (WAV)
                    </span>
                    <span className="text-xs leading-4 tracking-[0.2px] text-[#d6ceb8]">
                      {wavCreditLabel}
                    </span>
                  </div>
                </button>

                {sample?.has_stems && (
                  <button
                    type="button"
                    onClick={(e) => handleDownloadFull(e, { includeStemsZip: true })}
                    disabled={!sampleId || downloadLoading}
                    aria-busy={downloadLoading}
                    className="w-full min-h-[60px] px-4 py-3 rounded-sm bg-[#161410] text-[#fffbf0] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                  >
                    {downloadLoading ? (
                      <Loader2 className="size-6 animate-spin shrink-0" aria-hidden />
                    ) : (
                      <Download className="size-6 shrink-0" aria-hidden />
                    )}
                    <div className="flex min-w-0 flex-col items-start leading-none">
                      <span className="w-full text-left text-sm font-medium leading-5 tracking-[0.1px] wrap-break-word">
                        Download sample 
                        <br />
                        (WAV + STEMS)
                      </span>
                      <span className="text-xs leading-4 tracking-[0.2px] text-[#d6ceb8]">
                        {stemsCreditLabel}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Drawer open={detailsOpen} onOpenChange={setDetailsOpen} direction="bottom">
      <DrawerContent className="max-h-[90vh] flex flex-col bg-[#fffbf0] rounded-t-lg shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)] border-0">
        {/* Header: close only, right-aligned — Figma 1396-167380 */}
        <div className="flex items-center justify-end p-4 shrink-0">
          <DrawerClose
            className="size-6 flex items-center justify-center rounded-full text-[#5e584b] hover:bg-[#e8e2d2] hover:text-[#161410] transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </DrawerClose>
        </div>

        {/* Content — centered, sample + waveform — Figma 1396-167380 */}
        <div className="flex flex-col items-center px-6 pb-24 overflow-y-auto">
          <div className="flex flex-col items-center gap-8 w-full max-w-[326px]">
            {/* Sample: artwork + play overlay + info + tags + metadata + actions */}
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Artwork 190px with play overlay */}
              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                  className="relative shrink-0 size-[190px] rounded overflow-hidden border border-[#e8e2d2] bg-white"
                >
                  {row.imageUrl ? (
                    <img src={row.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
                  )}
                  <div
                    className={`absolute inset-0 bg-[#161410] transition-opacity ${isPlaying ? 'opacity-50' : 'opacity-0'}`}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                      {isPlaying ? (
                        <Pause className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
                      ) : (
                        <Play className="size-7 text-[#fffbf0] fill-[#fffbf0] shrink-0 pl-0.5" aria-hidden />
                      )}
                    </div>
                  </div>
                </button>

                {/* Info: name, creator, tags, metadata, actions */}
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col gap-2 items-center text-center">
                    <p className="text-[#161410] text-base font-bold leading-6 tracking-[0.1px]">
                      {row.name}
                    </p>
                    <p className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                      {row.creator}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 items-center w-full">
                    {/* Tags row */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {row.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]"
                        >
                          {tag}
                        </span>
                      ))}
                      {row.royaltyFree !== false && (
                        <span className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                          Royalty-Free
                        </span>
                      )}
                      {row.premium && (
                        <span className="bg-[#f3c16c] border border-[#eaaa3e] rounded-md h-5 px-1.5 inline-flex items-center justify-center">
                          <Crown className="size-3 shrink-0 text-[#161410]" aria-hidden />
                        </span>
                      )}
                    </div>
                    {/* Metadata: BPM • Key */}
                    {(row.bpm != null || row.key) && (
                      <div className="flex gap-2 items-center justify-center text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                        {row.bpm != null && <span>{row.bpm} BPM</span>}
                        {row.bpm != null && row.key && (
                          <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
                        )}
                        {row.key && <span>{row.key}</span>}
                      </div>
                    )}
                    {/* Action icons: Repeat, Heart, Download, More */}
                    <div className="flex gap-4 items-center justify-center">
                      <button
                        type="button"
                        className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2]"
                        aria-label="Loop"
                      >
                        <Repeat className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleFavorite}
                        disabled={likeBusy}
                        className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] disabled:opacity-50"
                        aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={liked}
                      >
                        <Heart className={`size-5 ${liked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDownloadFull(e, { includeStemsZip: false })}
                        disabled={!sampleId || downloadLoading}
                        aria-busy={downloadLoading}
                        className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Download"
                      >
                        {downloadLoading ? (
                          <Loader2 className="size-5 animate-spin" aria-hidden />
                        ) : (
                          <Download className="size-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2]"
                        aria-label="More options"
                      >
                        <MoreVertical className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sound wave + duration — Figma 1396-167380 */}
            <div className="w-full">
              <SoundWave
                duration={row.duration}
                progress={audioProgress}
                waveformBars={row.waveformBars}
                timeDisplay="remaining"
                emphasized={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    </>
  );
}
