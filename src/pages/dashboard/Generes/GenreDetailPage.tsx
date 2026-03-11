/**
 * Genre detail page – Figma 867-114383 (Genre Detail Page - Samples).
 * Back/Share, genre cover, overline + name, samples/packs counts, tags, description,
 * Tabs (Samples, Packs, Creators), filter bar + sample list or packs/creators carousels, Explore library CTA.
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, X } from 'lucide-react';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CardCarousel } from '@/components/CardCarousel';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { CreatorCard } from '@/components/CreatorCard';
import { SampleRow } from '@/components/SampleRow';
import { getGenreDetailById, type GenreDetail } from '@/lib/supabase/genres';
import { getAllGenres } from '@/lib/supabase/genres';
import { getGenreDetailMeta, genreNameToSlug } from '../constants';
import { SamplesFilterBar } from '../Samples/SamplesFilterBar';
import { SamplesFilterBarMobile } from '../Samples/SamplesFilterBarMobile';
import { SamplesFilterProvider } from '@/contexts/SamplesFilterContext';

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

const GENRE_DETAIL_TABS = [
  { id: 'samples', label: 'Samples' },
  { id: 'packs', label: 'Packs' },
  { id: 'creators', label: 'Creators' },
] as const;

export default function GenreDetailPage() {
  const { genreId: genreParam } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<(typeof GENRE_DETAIL_TABS)[number]['id']>('samples');
  const [detail, setDetail] = useState<GenreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const resolveGenreId = useCallback(async (param: string): Promise<string | null> => {
    if (isUuid(param)) return param;
    const genres = await getAllGenres();
    const slug = genreNameToSlug(param);
    const match = genres.find((g) => genreNameToSlug(g.name) === slug);
    return match?.id ?? null;
  }, []);

  useEffect(() => {
    if (!genreParam) {
      queueMicrotask(() => {
        setLoading(false);
        setNotFound(true);
      });
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true);
        setNotFound(false);
      }
    });
    resolveGenreId(genreParam)
      .then((resolvedId) => {
        if (cancelled || !resolvedId) {
          if (!resolvedId) setNotFound(true);
          setLoading(false);
          return;
        }
        return getGenreDetailById(resolvedId);
      })
      .then((data) => {
        if (cancelled) return;
        setDetail(data ?? null);
        if (!data?.genre) setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
          setNotFound(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [genreParam, resolveGenreId]);

  const clearGenreFilter = () => {
    navigate('/dashboard/genres');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
        <p className="text-[#5e584b] text-sm">Loading genre…</p>
      </div>
    );
  }

  if (notFound || !detail?.genre) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center gap-4">
        <p className="text-[#7f7766]">Genre not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/genres')}
          className="text-[#161410] font-medium underline hover:no-underline"
        >
          Back to Genres
        </button>
      </div>
    );
  }

  const genre = detail.genre;
  const meta = getGenreDetailMeta(genre.name);
  const genreSamples = detail.samples;
  const genrePacks = detail.packs;
  const genreCreators = detail.creators;
  const samplesCount = genre.samples_count ?? genreSamples.length;
  const packsCount = genre.packs_count ?? genrePacks.length;
  const description = genre.description ?? meta.description;

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-4 pt-8 pb-32 max-w-[1376px] mx-auto md:px-8">
        {/* Header – mobile: stacked (Figma 1602-177333); desktop: side-by-side */}
        <header className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-8 md:mb-0">
          {/* Back + Share row */}
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => navigate('/dashboard/genres')}
              className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] hover:opacity-80"
            >
              <ArrowLeft className="size-5" aria-hidden />
              Back
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] shrink-0 hover:opacity-80"
            >
              <Share2 className="size-5" aria-hidden />
              Share
            </button>
          </div>

          {/* Cover – mobile: 190px height full width; desktop: 326×326 */}
          <div className="rounded-[4px] w-full h-[190px] shrink-0 overflow-hidden bg-[#dde1e6] md:w-[326px] md:h-[326px]">
            {genre.thumbnail_url ? (
              <img
                src={genre.thumbnail_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#e8e2d2]" aria-hidden />
            )}
          </div>

          {/* Content – overline, title, metadata, divider, tags, description */}
          <div className="flex flex-col gap-6 flex-1 min-w-0 md:max-w-[911px] md:gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[#7f7766] text-xs tracking-[1px] uppercase">
                  Genre
                </p>
                <h1 className="text-[#161410] text-[28px] leading-[36px] font-bold tracking-[-0.2px] md:text-[32px] md:leading-tight md:tracking-[-0.6px] lg:text-[48px]">
                  {genre.name}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-[#5e584b] text-xs tracking-[0.2px] md:gap-2 md:text-sm md:tracking-[0.1px]">
                <span>{samplesCount} Samples</span>
                <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
                <span>{packsCount} Packs</span>
              </div>
            </div>

            <div className="border-t border-[#e8e2d2] w-full" aria-hidden />

            {/* Tags – Figma 867-108610 / 1602-181581 */}
            <div className="flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#e8e2d2] border border-[#d6ceb8] h-6 px-1.5 rounded-md flex items-center justify-center text-[#161410] text-xs font-medium tracking-[0.2px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px] max-w-[676px]">
              {description}
            </p>
          </div>
        </header>

        {/* Tabs – Figma 867-112011 */}
        <div className="border-b border-[#e8e2d2] flex gap-4 items-center mt-8 mb-6">
          {GENRE_DETAIL_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-12 items-center justify-center px-2 shrink-0 font-medium text-base leading-6 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-b-2 border-[#161410] text-[#161410]'
                    : 'border-b-2 border-transparent text-[#7f7766] hover:text-[#161410]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Samples tab: filter bar with Genre chip + sample list */}
        {activeTab === 'samples' && (
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <SamplesFilterProvider>
                <div className="md:hidden w-full">
                  <SamplesFilterBarMobile />
                </div>
                <div className="hidden md:block w-full">
                  <SamplesFilterBar />
                </div>
              </SamplesFilterProvider>
              <div className="flex gap-3 h-10 items-center">
                <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
                  Genre
                </span>
                <button
                  type="button"
                  onClick={clearGenreFilter}
                  className="bg-[#161410] text-[#fffbf0] h-10 px-3 rounded-full inline-flex items-center gap-2 text-sm font-medium tracking-[0.1px] hover:opacity-90 transition-opacity"
                  aria-label={`Clear genre filter ${genre.name}`}
                >
                  <span>{genre.name}</span>
                  <X className="size-5 shrink-0" />
                </button>
              </div>
            </div>
            <section className="w-full" aria-label={`Samples in ${genre.name}`}>
              <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
                {genreSamples.length > 0 ? (
                  genreSamples.map((sample) => (
                    <SampleRow key={sample.id} sample={sample} />
                  ))
                ) : (
                  <div className="p-8 text-center text-[#5e584b] text-sm">
                    No samples in this genre yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Packs tab */}
        {activeTab === 'packs' && (
          <div className="flex flex-col gap-8 mb-12">
            <CardCarousel title="Packs">
              {genrePacks.length > 0 ? (
                genrePacks.slice(0, 12).map((p) => (
                  <SamplePackCard
                    key={p.id}
                    pack={{
                      id: p.id,
                      name: p.name,
                      creator_name: p.creator_name,
                      download_count: p.download_count ?? undefined,
                      category_name: p.category_name ?? undefined,
                      is_premium: p.is_premium ?? false,
                    }}
                  />
                ))
              ) : (
                <p className="text-[#5e584b] text-sm py-4">No packs in this genre yet.</p>
              )}
            </CardCarousel>
          </div>
        )}

        {/* Creators tab */}
        {activeTab === 'creators' && (
          <div className="flex flex-col gap-8 mb-12">
            <CardCarousel title="Creators">
              {genreCreators.length > 0 ? (
                genreCreators.map((c) => (
                  <CreatorCard
                    key={c.id}
                    name={c.name}
                    samplesCount={String(c.samples_count)}
                    packsCount={String(c.packs_count)}
                  />
                ))
              ) : (
                <p className="text-[#5e584b] text-sm py-4">No creators in this genre yet.</p>
              )}
            </CardCarousel>
          </div>
        )}

      </div>
      <ExploreLibraryCta />
    </div>
  );
}
