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
import { SampleRow, type SimilarSampleItem } from '@/components/SampleRow';
import { getCreatorById } from '@/lib/supabase/creators';
import {
  PACKS_GRID_ITEMS,
  CREATORS_GRID_ITEMS,
  SAMPLES_LIST,
} from './constants';
import { SamplesFilterBar } from './SamplesFilterBar';

const CREATOR_DETAIL_TAGS = [
  'Chill',
  'Dreamy',
  'Jazzy',
  'Experimental',
  'Melodic',
  'Lo-Fi',
  'FX',
  '+5 more',
];
const CREATOR_DESCRIPTION =
  "The leading provider of premium sounds, from chart-topping hooks and topline melodies and experimental loops. We collaborate with the industry's most talented vocalists, engineers, and sound designers to deliver a pro sound which is contemporary, fresh...";

function mapSampleToList(sample: (typeof SAMPLES_LIST)[number], index: number): SimilarSampleItem {
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

  const creatorPacks = PACKS_GRID_ITEMS.filter((p) => p.creator === creator.name);
  const creatorSamples = SAMPLES_LIST.filter((s) => s.creator === creator.name);
  const sampleItems: SimilarSampleItem[] = creatorSamples.map(mapSampleToList);
  const similarCreators = CREATORS_GRID_ITEMS.filter(
    (c) => c.name !== creator.name
  ).slice(0, 8);

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

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {CREATOR_DETAIL_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#e8e2d2] border border-[#d6ceb8] h-6 px-1.5 rounded-md flex items-center justify-center text-[#161410] text-xs font-medium tracking-[0.2px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
              {descriptionExpanded
                ? CREATOR_DESCRIPTION
                : `${CREATOR_DESCRIPTION.slice(0, 180)}... `}
              <button
                type="button"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="text-[#161410] font-medium underline hover:no-underline"
              >
                {descriptionExpanded ? 'Show less' : 'Show more'}
              </button>
            </p>
          </div>
        </div>

        <div className="border-t border-[#e8e2d2] w-full my-8" aria-hidden />

        {/* Packs carousel */}
        <div className="flex flex-col gap-8 mb-12">
          <CardCarousel title="Packs">
            {creatorPacks.length > 0 ? (
              creatorPacks.slice(0, 8).map((p) => (
                <SamplePackCard
                  key={p.id}
                  packId={p.id}
                  title={p.title}
                  creator={p.creator}
                  playCount={p.playCount}
                  genre={p.genre}
                  premium={p.premium}
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
          <SamplesFilterBar />
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

        {/* Similar Creators – Figma 863-95877 */}
        <div className="flex flex-col gap-8 mb-12">
          <CardCarousel title="Similar Creators">
            {similarCreators.length > 0 ? (
              similarCreators.map((c) => (
                <CreatorCard
                  key={c.name}
                  name={c.name}
                  samplesCount={c.samplesCount}
                  packsCount={c.packsCount}
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
