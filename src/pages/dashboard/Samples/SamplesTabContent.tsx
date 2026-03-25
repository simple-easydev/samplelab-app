import { useEffect, useRef } from 'react';
import { AccessGate } from '@/components/AccessGate';
import { SampleRow } from '@/components/SampleRow';
import { useSubscription } from '@/hooks/useSubscription';
import { SamplesFilterBar } from './SamplesFilterBar';
import { SamplesFilterBarMobile } from './SamplesFilterBarMobile';
import { SamplesFilterProvider, useSamplesFilterBar } from '@/contexts/SamplesFilterContext';
import { useAudioPreviewPlayer } from '@/contexts/AudioPreviewPlayerContext';

/** Samples list with infinite scroll (paged RPC). */
function SamplesList() {
  const { samples, loading, loadingMore, hasMore, loadMore } = useSamplesFilterBar();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { setSampleQueue } = useAudioPreviewPlayer();

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries[0]?.isIntersecting;
        if (hit && hasMore && !loadingMore) void loadMore();
      },
      { root: null, rootMargin: '240px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, hasMore, loadingMore, loadMore]);

  useEffect(() => {
    // Register the currently rendered samples list as the playback queue.
    setSampleQueue(
      'samples-tab',
      samples
        .filter((s) => !!(s.preview_audio_url ?? s.audio_url))
        .map((s) => ({
          id: s.id,
          name: s.name,
          creatorName: s.creator_name,
          coverUrl: s.thumbnail_url,
          packId: s.pack_id,
          creatorId: s.creator_id ?? null,
          previewAudioUrl: (s.preview_audio_url ?? s.audio_url)!,
          durationLabel: (() => {
            const meta = s.metadata && typeof s.metadata !== 'string' ? s.metadata : null;
            if (meta?.duration_seconds != null) {
              const mins = Math.floor(meta.duration_seconds / 60);
              const secs = Math.floor(meta.duration_seconds % 60);
              return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            return '0:00';
          })(),
          bpm: s.bpm,
          key: s.key,
        }))
    );
  }, [samples, setSampleQueue]);

  return (
    <section className="w-full" aria-label="Samples list">
      <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
        {loading ? (
          <p className="text-[#5e584b] text-sm p-4">Loading samples…</p>
        ) : (
          <>
            {samples.map((s) => (
              <SampleRow key={s.id} sample={s} />
            ))}
            <div ref={sentinelRef} className="h-1 w-full shrink-0" aria-hidden />
            {loadingMore && (
              <p className="text-[#5e584b] text-sm p-4 border-t border-[#e8e2d2]">
                Loading more…
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Samples tab – Figma 812-47888.
 * Filter bar (Genre, Keywords, Instrument, Type, Stems, Key, BPM + search) and list of sample rows.
 */
export function SamplesTabContent() {
  const { isActive } = useSubscription();

  const content = (
    <SamplesFilterProvider>
      {/* Mobile: full-screen filters modal + search */}
      <div className="md:hidden w-full">
        <SamplesFilterBarMobile />
      </div>
      {/* Desktop: dropdown filter bar + search */}
      <div className="hidden md:block w-full">
        <SamplesFilterBar />
      </div>
      <SamplesList />
    </SamplesFilterProvider>
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
