import { useEffect, useState } from 'react';
import { SampleRow } from '@/components/SampleRow';
import { getSimilarSamplesByDownloadedSample, type SimilarSampleItem } from '@/lib/supabase/samples';

/**
 * "Because you downloaded …" section from Figma (node 789-45225):
 * similar samples list with title, subtitle "Updated daily", and rows with
 * thumbnail, name, creator, waveform, duration, tags, BPM • Key.
 */
export function SimilarSamplesSection() {
  const [items, setItems] = useState<SimilarSampleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await getSimilarSamplesByDownloadedSample({ p_limit: 5 });
        if (!cancelled) setItems(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || items.length === 0) return null;

  const sourceSampleName =
    items[0]?.seed_sample_name?.trim() || 'your last download';

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
        {items.map((sample) => (
          <SampleRow key={sample.id} sample={sample} />
        ))}
      </div>
    </section>
  );
}
