/**
 * Genre detail page – Figma 867-114383 (Genre Detail Page - Samples).
 * Back/Share, genre cover, overline + name, samples/packs counts, tags, description,
 * Tabs (Samples, Packs, Creators), filter bar + sample list or packs/creators carousels, Explore library CTA.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, X } from 'lucide-react';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CardCarousel } from '@/components/CardCarousel';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { CreatorCard } from '@/components/CreatorCard';
import { SampleRow, type SampleRowItem } from '@/components/SampleRow';
import {
  getGenreBySlug,
  getGenreDetailMeta,
  PACKS_GRID_ITEMS,
  CREATORS_GRID_ITEMS,
  SAMPLES_LIST,
} from './constants';
import { SamplesFilterBar } from './SamplesFilterBar';

function mapSampleToList(sample: (typeof SAMPLES_LIST)[number], index: number): SampleRowItem {
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

const GENRE_DETAIL_TABS = [
  { id: 'samples', label: 'Samples' },
  { id: 'packs', label: 'Packs' },
  { id: 'creators', label: 'Creators' },
] as const;

export default function GenreDetailPage() {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const genre = genreId ? getGenreBySlug(genreId) : undefined;
  const [activeTab, setActiveTab] = useState<(typeof GENRE_DETAIL_TABS)[number]['id']>('samples');

  if (!genreId || !genre) {
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

  const meta = getGenreDetailMeta(genre.name);
  const genreSamples = SAMPLES_LIST.filter(
    (s) => s.genre?.toLowerCase() === genre.name.toLowerCase()
  );
  const genrePacks = PACKS_GRID_ITEMS.filter(
    (p) => p.genre?.toLowerCase() === genre.name.toLowerCase()
  );
  const creatorNamesInGenre = new Set(genrePacks.map((p) => p.creator));
  const genreCreators = CREATORS_GRID_ITEMS.filter((c) => creatorNamesInGenre.has(c.name));

  const sampleItems: SampleRowItem[] = genreSamples.map(mapSampleToList);
  const samplesCount = genreSamples.length;
  const packsCount = genrePacks.length;

  const clearGenreFilter = () => {
    navigate('/dashboard/genres');
  };

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="px-8 pt-8 pb-32 max-w-[1376px] mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/genres')}
          className="flex items-center gap-1.5 text-[#161410] text-sm font-medium tracking-[0.1px] hover:opacity-80 mb-8"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>

        {/* Hero: cover + details – Figma 867-108596 */}
        <div className="flex gap-8 items-start flex-wrap">
          <div className="rounded-[4px] w-[326px] h-[326px] shrink-0 overflow-hidden bg-[#dde1e6]">
            {genre.imageUrl ? (
              <img
                src={genre.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#e8e2d2]" aria-hidden />
            )}
          </div>

          <div className="flex flex-col gap-8 flex-1 min-w-0 max-w-[911px]">
            {/* Overline + Share */}
            <div className="flex items-start justify-between gap-4">
              <p className="text-[#7f7766] text-sm tracking-[0.9px] uppercase">
                Genre
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
                {genre.name}
              </h1>
              <div className="flex items-center gap-2 text-[#5e584b] text-sm tracking-[0.1px]">
                <span>{samplesCount} Samples</span>
                <span className="size-1 rounded-full bg-[#5e584b]" aria-hidden />
                <span>{packsCount} Packs</span>
              </div>
            </div>

            <div className="border-t border-[#e8e2d2] w-full" aria-hidden />

            {/* Tags – Figma 867-108610 */}
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
              {meta.description}
            </p>
          </div>
        </div>

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
              <SamplesFilterBar />
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
                {sampleItems.length > 0 ? (
                  sampleItems.map((item) => (
                    <SampleRow key={item.id} item={item} />
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
                    packId={p.id}
                    title={p.title}
                    creator={p.creator}
                    playCount={p.playCount}
                    genre={p.genre}
                    premium={p.premium}
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
                    key={c.name}
                    name={c.name}
                    samplesCount={c.samplesCount}
                    packsCount={c.packsCount}
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
