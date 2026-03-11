/**
 * Creator detail page – Figma 863-95877.
 * Back/Share, circular avatar, overline + name, samples/packs counts, tags, description,
 * Packs carousel, Samples filter bar + list, Similar Creators carousel, Explore library CTA.
 * Resolves creator by URL param creatorId (UUID).
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CardCarousel } from '@/components/CardCarousel';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { CreatorCard } from '@/components/CreatorCard';
import { SampleRow, type SampleRowItem } from '@/components/SampleRow';
import { getCreatorById, type CreatorDetail } from '@/lib/supabase/creators';
import { SamplesFilterBar } from '../Samples/SamplesFilterBar';
import { SamplesFilterBarMobile } from '../Samples/SamplesFilterBarMobile';
import { SamplesFilterProvider } from '@/contexts/SamplesFilterContext';

function mapSampleToRowItem(
  sample: CreatorDetail['samples'][number],
  creatorName: string
): SampleRowItem {
  const tags: string[] = sample.type ? [sample.type] : [];
  return {
    id: sample.id,
    name: sample.name,
    creator: creatorName,
    duration: sample.length ?? '—',
    tags,
    royaltyFree: false,
    premium: false,
    bpm: sample.bpm ?? undefined,
    key: sample.key ?? undefined,
    imageUrl: null,
  };
}

export default function CreatorDetailPage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Awaited<ReturnType<typeof getCreatorById>>>(null);
  const [loading, setLoading] = useState(true);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!creatorId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    getCreatorById(creatorId)
      .then((data) => {
        if (!cancelled) setCreator(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  if (!creatorId || loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center gap-4">
        <p className="text-[#7f7766]">{creatorId ? 'Loading…' : 'Creator not found.'}</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center gap-4">
        <p className="text-[#7f7766]">Creator not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/creators')}
          className="text-[#161410] font-medium underline hover:no-underline"
        >
          Back to Creators
        </button>
      </div>
    );
  }

  const displayTags = [
    ...creator.tags,
    ...creator.genres.map((g) => g.name),
  ].filter(Boolean);
  const sampleItems: SampleRowItem[] = creator.samples.map((s) =>
    mapSampleToRowItem(s, creator.name)
  );
  const descriptionText = creator.description ?? '';
  const descriptionPreviewLen = 180;

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 max-w-6xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/creators')}
          className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] hover:opacity-80 mb-8"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>

        {/* Hero: avatar + details */}
        <div className="flex gap-8 items-start flex-wrap">
          {/* Circular avatar – Figma 326px */}
          <div className="rounded-full w-[326px] h-[326px] shrink-0 overflow-hidden bg-[#e8e2d2]">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#dde1e6]" aria-hidden />
            )}
          </div>

          <div className="flex flex-col gap-8 flex-1 min-w-0 max-w-[911px]">
            {/* Overline + Share */}
            <div className="flex items-start justify-between gap-4">
              <p className="text-[#7f7766] text-sm tracking-[0.9px] uppercase">
                Creator
              </p>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] shrink-0 hover:opacity-80"
              >
                <Share2 className="size-5" />
                Share
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-[#161410] text-[32px] sm:text-[48px] font-bold leading-tight tracking-[-0.6px]">
                {creator.name}
              </h1>
              <div className="flex items-center gap-2 text-[#5e584b] text-sm tracking-[0.1px]">
                <span>{creator.samples_count} Samples</span>
                <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
                <span>{creator.packs_count} Packs</span>
              </div>
            </div>

            <div className="border-t border-[#e8e2d2] w-full" aria-hidden />

            {/* Tags / genres */}
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="bg-[#e8e2d2] border border-[#d6ceb8] h-6 px-1.5 rounded-md flex items-center justify-center text-[#161410] text-xs font-medium tracking-[0.2px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {descriptionText && (
              <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                {descriptionExpanded
                  ? descriptionText
                  : `${descriptionText.slice(0, descriptionPreviewLen)}${descriptionText.length > descriptionPreviewLen ? '... ' : ''}`}
                {descriptionText.length > descriptionPreviewLen && (
                  <button
                    type="button"
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="text-[#161410] font-medium underline hover:no-underline"
                  >
                    {descriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-[#e8e2d2] w-full my-8" aria-hidden />

        {/* Packs carousel */}
        <div className="flex flex-col gap-8 mb-12">
          <CardCarousel title="Packs">
            {creator.packs.length > 0 ? (
              creator.packs.map((p) => (
                <SamplePackCard
                  key={p.id}
                  packId={p.id}
                  title={p.name}
                  creator={creator.name}
                  playCount={p.download_count != null ? String(p.download_count) : undefined}
                  genre={p.tags?.[0] ?? undefined}
                  premium={p.is_premium ?? false}
                  imageUrl={p.cover_url ?? undefined}
                />
              ))
            ) : (
              <p className="text-[#5e584b] text-sm py-4">No packs yet.</p>
            )}
          </CardCarousel>
        </div>

        {/* Samples: filter bar + rows */}
        <div className="flex flex-col gap-8 mb-12">
          <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
            Samples
          </h2>
          <SamplesFilterProvider>
            <div className="md:hidden w-full">
              <SamplesFilterBarMobile />
            </div>
            <div className="hidden md:block w-full">
              <SamplesFilterBar />
            </div>
          </SamplesFilterProvider>
          <section className="w-full" aria-label="Samples by this creator">
            <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
              {sampleItems.length > 0 ? (
                sampleItems.map((item) => (
                  <SampleRow key={item.id} item={item} />
                ))
              ) : (
                <div className="p-8 text-center text-[#5e584b] text-sm">
                  No samples yet.
                </div>
              )}
        </div>
        </section>
        </div>

        {/* Similar Creators */}
        <div className="flex flex-col gap-8 mb-12">
          <CardCarousel title="Similar Creators">
            {creator.similar_creators.length > 0 ? (
              creator.similar_creators.map((c) => (
                <CreatorCard
                  key={c.id}
                  creatorId={c.id}
                  name={c.name}
                  imageUrl={c.avatar_url ?? undefined}
                />
              ))
            ) : (
              <p className="text-[#5e584b] text-sm py-4">No similar creators.</p>
            )}
          </CardCarousel>
        </div>

      </div>
        <ExploreLibraryCta />
    </div>
  );
}
