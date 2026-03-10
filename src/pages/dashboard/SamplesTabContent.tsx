import { useEffect, useMemo, useState } from 'react';
import { AccessGate } from '@/components/AccessGate';
import { SampleRow, type SimilarSampleItem } from '@/components/SampleRow';
import { useSubscription } from '@/hooks/useSubscription';
import { getAllSamples, getSampleMetadata, formatDurationSeconds } from '@/lib/supabase/samples';
import { SamplesFilterBar } from './SamplesFilterBar';

function mapAllSampleToSimilarItem(
  sample: Awaited<ReturnType<typeof getAllSamples>>[number]
): SimilarSampleItem {
  const tags: string[] = [];
  if (sample.genre) tags.push(sample.genre);
  tags.push(sample.pack_name);
  if (sample.has_stems) tags.push('Stems');
  if (sample.type) tags.push(sample.type);

  const metadata = getSampleMetadata(sample);

  return {
    id: sample.id,
    name: sample.name,
    creator: sample.creator_name,
    duration: metadata ? formatDurationSeconds(metadata.duration_seconds) : '—',
    waveformBars: metadata?.bars,
    audioUrl: sample.audio_url ?? undefined,
    tags,
    royaltyFree: true,
    premium: false,
    bpm: sample.bpm ?? undefined,
    key: sample.key ?? undefined,
    imageUrl: sample.thumbnail_url ?? undefined,
  };
}

/**
 * Samples tab – Figma 812-47888.
 * Filter bar (Genre, Keywords, Instrument, Type, Stems, Key, BPM + search) and list of sample rows.
 */
export function SamplesTabContent() {
  const { isActive } = useSubscription();

  const [samples, setSamples] = useState<Awaited<ReturnType<typeof getAllSamples>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getAllSamples()
      .then((data) => {
        if (!cancelled) {
          setSamples(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sampleItems: SimilarSampleItem[] = useMemo(
    () => samples.map(mapAllSampleToSimilarItem),
    [samples]
  );

  const content = (
    <>
      <SamplesFilterBar />
      <section className="w-full" aria-label="Samples list">
        <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
          {loading ? (
            <p className="text-[#5e584b] text-sm p-4">Loading samples…</p>
          ) : (
            sampleItems.map((item) => <SampleRow key={item.id} item={item} />)
          )}
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
