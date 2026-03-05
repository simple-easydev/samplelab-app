import { useState } from 'react';
import { Crown } from 'lucide-react';

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

export interface SimilarSamplesSectionProps {
  /** The name of the sample the user previously downloaded (shown in the title). Omit to use default. */
  sourceSampleName?: string;
  /** Similar sample items. Omit to use default mock data. */
  items?: SimilarSampleItem[];
}

const SIMILAR_SAMPLES_SOURCE = 'Sample Name';

const SIMILAR_SAMPLES_ITEMS: SimilarSampleItem[] = [
  {
    id: '1',
    name: 'Sample name goes here',
    creator: 'Creator name',
    duration: '0:34',
    progress: 0.2,
    tags: ['Hip-Hop', 'Loop', 'Stems'],
    royaltyFree: true,
    premium: false,
    bpm: 120,
    key: 'F Minor',
  },
  {
    id: '2',
    name: 'Sample name goes here',
    creator: 'Creator name',
    duration: '0:34',
    progress: 0.65,
    tags: ['Hip-Hop', 'Loop', 'Stems'],
    royaltyFree: true,
    premium: true,
    bpm: 120,
    key: 'F Minor',
  },
  {
    id: '3',
    name: 'Lo-Fi Keys Loop',
    creator: 'Beat Lab',
    duration: '0:28',
    progress: 0,
    tags: ['Lo-Fi', 'Loop'],
    royaltyFree: true,
    bpm: 92,
    key: 'C Major',
  },
  {
    id: '4',
    name: 'Trap Hi-Hat Sequence',
    creator: 'Sound Factory',
    duration: '0:45',
    progress: 0.9,
    tags: ['Trap', 'One-Shot'],
    royaltyFree: true,
    premium: true,
    bpm: 140,
    key: 'A Minor',
  },
  {
    id: '5',
    name: 'Soul Chop 04',
    creator: 'Vinyl Revival',
    duration: '0:22',
    progress: 0.45,
    tags: ['Soul', 'Stems', 'Loop'],
    royaltyFree: true,
    bpm: 88,
    key: 'E Minor',
  },
];

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

/** Parses "M:SS" or "MM:SS" to total seconds. */
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
  className?: string;
}

function SoundWave({
  duration,
  progress: progressProp = 0,
  timeDisplay = 'remaining',
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
                  background: played ? '#d6ceb8' : 'rgba(214, 206, 184, 0.35)',
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

/** Grid column widths so every row has the same column layout (grid system). */
const ROW_GRID_COLUMNS = 'minmax(0, 280px) minmax(260px, 340px) minmax(160px, 1fr) 140px';

function SimilarSampleRow({ item }: { item: SimilarSampleItem }) {
  return (
    <div className="bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex flex-col items-stretch p-4 w-full">
      <div
        className="grid w-full gap-4 items-center"
        style={{ gridTemplateColumns: ROW_GRID_COLUMNS }}
      >
        {/* Column 1: Thumbnail + sample name + creator */}
        <div className="flex gap-4 h-14 items-center min-w-0">
          <div className="bg-white rounded-sm size-14 shrink-0 overflow-hidden border border-[#e8e2d2]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full bg-[#e8e2d2]" aria-hidden />
            )}
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

        {/* Column 2: Waveform + time */}
        <div className="hidden sm:flex items-center gap-2 min-w-0 w-full">
          <SoundWave
            duration={item.duration}
            progress={item.progress ?? 0}
            timeDisplay="passed"
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

        {/* Column 4: BPM • Key */}
        <div className="flex items-center gap-2 justify-end min-w-[140px]">
          {item.bpm != null && (
            <>
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
            </>
          )}
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

/**
 * "Because you downloaded …" section from Figma (node 789-45225):
 * similar samples list with title, subtitle "Updated daily", and rows with
 * thumbnail, name, creator, waveform, duration, tags, BPM • Key.
 */
export function SimilarSamplesSection({
  sourceSampleName = SIMILAR_SAMPLES_SOURCE,
  items = SIMILAR_SAMPLES_ITEMS,
}: SimilarSamplesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
          Because you downloaded &quot;{sourceSampleName}&quot;
        </h2>
        <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
          Updated daily
        </p>
      </div>
      <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
        {items.map((item) => (
          <SimilarSampleRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
