import { SampleRow, type SimilarSampleItem } from '@/components/SampleRow';

export type { SimilarSampleItem } from '@/components/SampleRow';

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
          <SampleRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
