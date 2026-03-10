import { useState } from 'react';
import { Crown, Play, Heart, Download, MoreVertical, FolderOpen, User, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SimilarSampleItem {
  id: string;
  name: string;
  creator: string;
  duration: string;
  /** Play progress 0–1 (e.g. 0.35 = 35% played). Used by SoundWave. */
  progress?: number;
  /** First row: e.g. genre, type (Loop), Stems */
  tags: string[];
  /** Second row: show "Royalty-Free" */
  royaltyFree?: boolean;
  /** Second row: show premium crown badge */
  premium?: boolean;
  bpm?: number;
  key?: string;
  imageUrl?: string | null;
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
  /** Show elapsed time (e.g. "0:12") or remaining time (e.g. "0:22"). Default "remaining". */
  timeDisplay?: SoundWaveTimeDisplay;
  /** When true, waveform bars use darker colors (hover/active state). */
  emphasized?: boolean;
  className?: string;
}

function SoundWave({
  duration,
  progress: progressProp = 0,
  timeDisplay = 'remaining',
  emphasized = false,
  className,
}: SoundWaveProps) {
  const durationSec = parseDurationToSeconds(duration);
  const [seekElapsed, setSeekElapsed] = useState<number | null>(null);

  const progress = Math.max(0, Math.min(1, progressProp));
  const elapsed = seekElapsed ?? progress * durationSec;
  const effectiveProgress = durationSec > 0 ? elapsed / durationSec : 0;
  const playedIndex = Math.floor(effectiveProgress * BAR_COUNT);

  const handleBarClick = (i: number) => {
    const newElapsed = (i / BAR_COUNT) * durationSec;
    setSeekElapsed(+newElapsed.toFixed(1));
  };

  const displayTime =
    timeDisplay === 'passed'
      ? formatTime(Math.min(elapsed, durationSec))
      : formatTime(Math.max(0, durationSec - elapsed));

  const playedColor = emphasized ? '#161410' : '#d6ceb8';
  const unplayedColor = emphasized ? 'rgba(22, 20, 16, 0.35)' : 'rgba(214, 206, 184, 0.35)';

  return (
    <div
      className={className}
      role="group"
      aria-label="Waveform"
    >
      <div className="flex items-center gap-2 h-10 min-w-0 flex-1 max-w-[277px]">
        <div
          className="flex items-center flex-1 h-full gap-0.5 cursor-pointer min-w-0"
          style={{ minHeight: '40px' }}
        >
          {WAVEFORM.map((val, i) => {
            const played = i <= playedIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleBarClick(i)}
                className="flex-1 min-w-[2px] max-w-[4.5px] rounded-full transition-colors duration-150 ease-out border-0 cursor-pointer p-0"
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

const ROW_GRID_COLUMNS = 'minmax(0, 280px) minmax(260px, 340px) minmax(160px, 1fr) 140px';

export interface SampleRowProps {
  item: SimilarSampleItem;
  /** When "compact", only thumbnail + name + creator (and optional rank) are shown. Default "full". */
  variant?: 'full' | 'compact';
  /** Optional rank number; shown as leading column when variant is "compact". */
  rank?: number;
  /** When true, show filled heart and "Remove from favorites" (e.g. on Favorites page). */
  isFavorited?: boolean;
}

export function SampleRow({ item, variant = 'full', rank, isFavorited = false }: SampleRowProps) {
  const [fullRowHovered, setFullRowHovered] = useState(false);

  if (variant === 'compact') {
    return (
      <div className="group bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex gap-4 items-center p-4 w-full transition-[background-color] duration-200 hover:bg-[#FFFBF0]">
        {rank != null && (
          <span className="text-[#161410] text-base font-medium leading-6 text-center w-4 shrink-0">
            {rank}
          </span>
        )}
        {/* Thumbnail with hover overlay + play button (Figma 804-32679) */}
        <div className="relative size-14 shrink-0 rounded-sm overflow-hidden border border-[#e8e2d2] bg-white">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
          )}
          <div
            className="absolute inset-0 bg-[#161410] opacity-0 transition-opacity duration-200 group-hover:opacity-50"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
              <Play className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
          <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
            {item.name}
          </p>
          <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
            {item.creator}
          </p>
        </div>
        {/* Like + Download icons (visible on hover) */}
        <div className="flex gap-1 items-center shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="size-9 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`size-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="size-9 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
            aria-label="Download"
          >
            <Download className="size-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex flex-col items-stretch p-4 w-full transition-[background-color] duration-200 hover:bg-[#FFFBF0]"
      onMouseEnter={() => setFullRowHovered(true)}
      onMouseLeave={() => setFullRowHovered(false)}
    >
      <div
        className="grid w-full gap-4 items-center"
        style={{ gridTemplateColumns: ROW_GRID_COLUMNS }}
      >
        {/* Column 1: Thumbnail (with hover play overlay) + sample name + creator – Figma 804-36336 */}
        <div className="flex gap-4 h-14 items-center min-w-0">
          <div className="relative size-14 shrink-0 rounded-sm overflow-hidden border border-[#e8e2d2] bg-white">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
            )}
            <div
              className="absolute inset-0 bg-[#161410] opacity-0 transition-opacity duration-200 group-hover:opacity-50"
              aria-hidden
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
                <Play className="size-5 text-[#fffbf0] fill-[#fffbf0] shrink-0" aria-hidden />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
            <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
              {item.name}
            </p>
            <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
              {item.creator}
            </p>
          </div>
        </div>

        {/* Column 2: Waveform + time (darker on hover) */}
        <div className="hidden sm:flex items-center gap-2 min-w-0 w-full">
          <SoundWave
            duration={item.duration}
            progress={item.progress ?? 0}
            timeDisplay="passed"
            emphasized={fullRowHovered}
            className="h-10 shrink-0 flex-1 min-w-0"
          />
        </div>

        {/* Column 3: Tags */}
        <div className="flex flex-col gap-2 items-start justify-center min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {item.royaltyFree !== false && (
              <span className="bg-[#e8e2d2] border border-[#d6ceb8] rounded-md h-5 px-1.5 inline-flex items-center justify-center text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                Royalty-Free
              </span>
            )}
            {item.premium && (
              <span className="bg-[#f3c16c] border border-[#eaaa3e] rounded-md h-5 px-1.5 inline-flex items-center justify-center gap-0.5 text-[#161410]">
                <Crown className="size-3 shrink-0" aria-hidden />
              </span>
            )}
          </div>
        </div>

        {/* Column 4: BPM • Key + action icons (visible on hover) */}
        <div className="flex items-center gap-3 justify-end min-w-[140px]">
          {item.bpm != null && (
            <div className="flex gap-2 items-center shrink-0">
              <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                {item.bpm} BPM
              </span>
              {item.key && (
                <>
                  <span className="text-[#5e584b] size-1 rounded-full bg-[#5e584b] shrink-0" aria-hidden />
                  <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                    {item.key}
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex gap-1 items-center shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="size-9 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`size-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="size-9 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
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
                  className="size-9 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
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
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => e.preventDefault()}
                >
                  <FolderOpen className="size-5 shrink-0" aria-hidden />
                  View pack
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => e.preventDefault()}
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
      {/* Mobile: show duration under name when waveform is hidden */}
      <div className="sm:hidden mt-2 flex items-center gap-2">
        <span className="text-[#5e584b] text-xs">{item.duration}</span>
        {item.bpm != null && (
          <>
            <span className="text-[#5e584b] size-1 rounded-full bg-[#5e584b]" />
            <span className="text-[#5e584b] text-xs">{item.bpm} BPM</span>
          </>
        )}
        {item.key && (
          <>
            <span className="text-[#5e584b] size-1 rounded-full bg-[#5e584b]" />
            <span className="text-[#5e584b] text-xs">{item.key}</span>
          </>
        )}
      </div>
    </div>
  );
}
