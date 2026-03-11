import { useEffect, useMemo, useState } from 'react';
import { AccessGate } from '@/components/AccessGate';
import { SampleRow, type SampleRowItem } from '@/components/SampleRow';
import { useSubscription } from '@/hooks/useSubscription';
import { getAllSamples } from '@/lib/supabase/samples';
import { SamplesFilterBar } from './SamplesFilterBar';
import { SamplesFilterBarMobile } from './SamplesFilterBarMobile';
import { SamplesFilterProvider } from '@/contexts/SamplesFilterContext';
import { mapAllSampleToRowItem } from '@/lib/utils';



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

  const sampleItems: SampleRowItem[] = useMemo(
    () => samples.map(mapAllSampleToRowItem),
    [samples]
  );

  const content = (
    <>
      <SamplesFilterProvider>
        {/* Mobile: full-screen filters modal + search */}
        <div className="md:hidden w-full">
          <SamplesFilterBarMobile />
        </div>
        {/* Desktop: dropdown filter bar + search */}
        <div className="hidden md:block w-full">
          <SamplesFilterBar />
        </div>
      </SamplesFilterProvider>
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
