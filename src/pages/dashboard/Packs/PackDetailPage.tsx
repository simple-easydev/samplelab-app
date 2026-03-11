/**
 * Sample pack detail page – Figma 857-69521.
 * Back/Share, cover + details, Get Pack / Play Preview / Heart, tags, description,
 * sample list with filters, Similar Packs carousel, Explore library CTA.
 * Data from Supabase RPC get_pack_by_id.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Play, Heart } from 'lucide-react';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CardCarousel } from '@/components/CardCarousel';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { SampleRow } from '@/components/SampleRow';
import { getPackById, type PackDetail } from '@/lib/supabase/packs';
import { packDetailSampleToSampleItem } from '@/lib/utils';
import { SamplesFilterBar } from '../Samples/SamplesFilterBar';
import { SamplesFilterBarMobile } from '../Samples/SamplesFilterBarMobile';
import { SamplesFilterProvider } from '@/contexts/SamplesFilterContext';

function formatReleasedAt(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return 'Released today';
  if (diffDays === 1) return 'Released 1d ago';
  if (diffDays < 7) return `Released ${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return 'Released 1w ago';
  if (diffWeeks < 4) return `Released ${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Released 1mo ago';
  if (diffMonths < 12) return `Released ${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? 'Released 1y ago' : `Released ${diffYears}y ago`;
}

export default function PackDetailPage() {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const [pack, setPack] = useState<PackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!packId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    getPackById(packId)
      .then((data) => {
        if (!cancelled) setPack(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [packId]);

  if (!packId || loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center gap-4">
        <p className="text-[#7f7766]">{packId ? 'Loading…' : 'Pack not found.'}</p>
      </div>
    );
  }

  if (!pack) {
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

  const genreLabel = pack.genres?.[0] ?? pack.category_name ?? '—';
  const displayTags = pack.tags && pack.tags.length > 0 ? pack.tags : [];
  const description = pack.description ?? '';

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
            {pack.cover_url ? (
              <img
                src={pack.cover_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#e8e2d2]" aria-hidden />
            )}
            {pack.is_premium && (
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
                {pack.name}
              </h1>
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-[#e8e2d2] shrink-0" aria-hidden />
                <span className="text-[#161410] text-lg font-medium truncate">
                  {pack.creator_name}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-[#5e584b] text-sm tracking-[0.1px]">
              <span>{pack.samples_count} Samples</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>{genreLabel}</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>Royalty-Free</span>
              <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
              <span>{formatReleasedAt(pack.created_at)}</span>
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
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#e8e2d2] border border-[#d6ceb8] h-6 px-1.5 rounded-md flex items-center justify-center text-[#161410] text-xs font-medium tracking-[0.2px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                {descriptionExpanded
                  ? description
                  : `${description.slice(0, 180)}${description.length > 180 ? '... ' : ''}`}
                {description.length > 180 && (
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

        {/* Sample list: filter bar + rows (same as Samples tab) */}
        <div className="flex flex-col gap-8 mb-12">
          <SamplesFilterProvider>
            <div className="md:hidden w-full">
              <SamplesFilterBarMobile />
            </div>
            <div className="hidden md:block w-full">
              <SamplesFilterBar />
            </div>
          </SamplesFilterProvider>
          <section className="w-full" aria-label="Samples in this pack">
            <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
              {pack.samples.length > 0 ? (
                pack.samples.map((s) => (
                  <SampleRow
                    key={s.id}
                    sample={packDetailSampleToSampleItem(s, pack.creator_name, pack.name)}
                  />
                ))
              ) : (
                <p className="text-[#5e584b] text-sm py-6 px-4">
                  No samples in this pack yet.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Similar Packs */}
        <CardCarousel title="Similar Packs">
          {pack.similar_packs.length > 0 ? (
            pack.similar_packs.slice(0, 6).map((p) => (
              <SamplePackCard
                key={p.id}
                pack={{
                  id: p.id,
                  name: p.name,
                  creator_name: p.creator_name,
                  cover_url: p.cover_url,
                  download_count: p.samples_count,
                  category_name: p.genres?.[0] ?? p.category_name ?? undefined,
                  is_premium: p.is_premium ?? false,
                }}
              />
            ))
          ) : (
            <p className="text-[#5e584b] text-sm py-4">No similar packs.</p>
          )}
        </CardCarousel>
      </div>
      <ExploreLibraryCta />
    </div>
  );
}
