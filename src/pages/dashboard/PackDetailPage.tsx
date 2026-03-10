/**
 * Sample pack detail page – Figma 857-69521.
 * Back/Share, cover + details, Get Pack / Play Preview / Heart, tags, description,
 * sample list with filters, Similar Packs carousel, Explore library CTA.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Play, Heart } from 'lucide-react';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CardCarousel } from '@/components/CardCarousel';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { SampleRow, type SimilarSampleItem } from '@/components/SampleRow';
import {
  getPackById,
  FEATURED_PACKS,
  SIMILAR_PACKS_TO_LIKES,
  SAMPLES_LIST,
} from './constants';
import { SamplesFilterBar } from './SamplesFilterBar';

const PACK_DETAIL_TAGS = ['Chill', 'Dreamy', 'Vocals', 'Experimental', 'Melodic', 'Lo-Fi', 'FX', '+5 more'];
const PACK_DESCRIPTION =
  "This pack is a carefully curated collection of Hip-Hop-focused samples designed to bring character, texture, and musicality into your productions. Every sound was created with real-world use in mind—whether you're sketching ideas quickly or polishing a final release. Inside, you'll find a blend of drums, melodies, and one-shots ready to drop into your sessions.";

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

export default function PackDetailPage() {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const pack = packId ? getPackById(packId) : undefined;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  if (!packId || !pack) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center gap-4">
        <p className="text-[#7f7766]">Pack not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/packs')}
          className="text-[#161410] font-medium underline hover:no-underline"
        >
          Back to Packs
        </button>
      </div>
    );
  }

  const similarPacks = [...SIMILAR_PACKS_TO_LIKES, ...FEATURED_PACKS].filter((p) => p.id !== pack.id);
  const uniqueSimilar = similarPacks.filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
  );
  const sampleItems: SimilarSampleItem[] = SAMPLES_LIST.map(mapSampleListItemToSimilarItem);

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 max-w-6xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/packs')}
          className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] hover:opacity-80 mb-8"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>

        {/* Hero: cover + details */}
        <div className="flex gap-8 items-start flex-wrap">
          {/* Cover */}
          <div className="bg-[#dde1e6] rounded overflow-hidden shrink-0 w-[326px] h-[326px] relative">
            <div className="w-full h-full bg-[#e8e2d2]" aria-hidden />
            {pack.premium && (
              <div className="absolute top-4 right-4 bg-[#f3c16c] border border-[#eaaa3e] flex items-center justify-center h-6 px-1.5 rounded-md">
                <span className="text-[#161410] text-xs font-medium tracking-[0.2px] uppercase">
                  Premium
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 flex-1 min-w-0 max-w-[911px]">
            {/* Overline + Share */}
            <div className="flex items-start justify-between gap-4">
              <p className="text-[#7f7766] text-sm tracking-[0.9px] uppercase">
                Sample pack
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
              <h1 className="text-[#161410] text-[32px] sm:text-[40px] font-bold leading-tight tracking-[-0.6px]">
                {pack.title}
              </h1>
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-[#e8e2d2] shrink-0" aria-hidden />
                <span className="text-[#161410] text-lg font-medium truncate">{pack.creator}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-[#5e584b] text-sm tracking-[0.1px]">
              <span>80 Samples</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>{pack.genre ?? '—'}</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>Royalty-Free</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>Released 2w ago</span>
            </div>

            <div className="border-t border-[#e8e2d2] w-full" aria-hidden />

            {/* Actions */}
            <div className="flex gap-4 items-center flex-wrap">
              <button
                type="button"
                className="bg-[#161410] text-[#fffbf0] h-14 px-5 rounded-[2px] flex items-center gap-2.5 text-lg font-medium hover:opacity-90"
              >
                <Download className="size-7" />
                Get Pack
              </button>
              <button
                type="button"
                className="border border-[#a49a84] h-14 px-5 rounded-[2px] flex items-center gap-2.5 text-[#161410] text-lg font-medium hover:bg-[#e8e2d2] transition-colors"
              >
                <Play className="size-7" />
                Play Preview
              </button>
              <button
                type="button"
                className="border border-[#a49a84] size-14 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#e8e2d2] transition-colors"
                aria-label="Add to favorites"
              >
                <Heart className="size-7" />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {PACK_DETAIL_TAGS.map((tag) => (
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
              {descriptionExpanded ? PACK_DESCRIPTION : `${PACK_DESCRIPTION.slice(0, 180)}... `}
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

        {/* Sample list: filter bar + rows (same as Samples tab) */}
        <div className="flex flex-col gap-8 mb-12">
          <SamplesFilterBar />
          <section className="w-full" aria-label="Samples in this pack">
            <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
              {sampleItems.map((item) => (
                <SampleRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        {/* Similar Packs */}
        <CardCarousel title="Similar Packs">
          {uniqueSimilar.slice(0, 6).map((p) => (
            <SamplePackCard
              key={p.id}
              packId={p.id}
              title={p.title}
              creator={p.creator}
              playCount={p.playCount}
              genre={p.genre}
              premium={p.premium}
            />
          ))}
        </CardCarousel>

      </div>
        <ExploreLibraryCta />
    </div>
  );
}
