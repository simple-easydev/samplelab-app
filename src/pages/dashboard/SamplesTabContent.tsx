import { AccessGate } from '@/components/AccessGate';
import { SampleRow, type SimilarSampleItem } from '@/components/SampleRow';
import { useSubscription } from '@/hooks/useSubscription';
import { SamplesFilterBar } from './SamplesFilterBar';
import { SAMPLES_LIST } from './constants';

function mapSampleListItemToSimilarItem(
  sample: (typeof SAMPLES_LIST)[number],
  index: number
): SimilarSampleItem {
  const tags: string[] = [];
  if (sample.genre) tags.push(sample.genre);
  if (sample.tags?.length) tags.push(...sample.tags);
  const bpmNum =
    sample.bpm != null ? parseInt(sample.bpm.replace(/\D/g, ''), 10) : undefined;
  return {
    id: `sample-${index}`,
    name: sample.name,
    creator: sample.creator,
    duration: sample.duration,
    tags,
    royaltyFree: sample.license === 'Royalty-Free',
    premium: sample.premium ?? false,
    bpm: Number.isNaN(bpmNum) ? undefined : bpmNum,
    key: sample.key,
    imageUrl: sample.imageUrl ?? null,
  };
}

/**
 * Samples tab – Figma 812-47888.
 * Filter bar (Genre, Keywords, Instrument, Type, Stems, Key, BPM + search) and list of sample rows.
 */
export function SamplesTabContent() {
  const { isActive } = useSubscription();

  const sampleItems: SimilarSampleItem[] = SAMPLES_LIST.map(mapSampleListItemToSimilarItem);

  const content = (
    <>
      <SamplesFilterBar />
      <section className="w-full" aria-label="Samples list">
        <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
          {sampleItems.map((item) => (
            <SampleRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );

  if (isActive) {
    return <div className="mb-8 flex flex-col gap-8">{content}</div>;
  }

  return (
    <div className="relative mb-8 max-h-[calc(100vh-14rem)] overflow-hidden">
      <div className="flex flex-col gap-8 pb-24">
        {content}
      </div>
      <AccessGate />
    </div>
  );
}
