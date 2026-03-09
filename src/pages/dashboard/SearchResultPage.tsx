/**
 * Search result page – Figma 821-69479 (Search Result - All).
 * Tabs (All, Packs, Samples, Creators, Genres), samples grid with result count + filter chip,
 * then Packs, Creators, Genres carousels.
 */
import { useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { SampleSearchRow } from '@/components/SampleSearchRow';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';
import {
  FEATURED_PACKS,
  FEATURED_CREATORS,
  GENRES_GRID_ITEMS,
  TRENDING_ITEMS,
  NEW_RELEASES_ITEMS,
} from './constants';
import { AccessGate } from '@/components/AccessGate';

const SEARCH_RESULT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

/** Mock sample items for search grid (name, creator); split into columns. */
const SEARCH_SAMPLE_ITEMS = [
  ...TRENDING_ITEMS.map(({ name, creator }) => ({ name, creator, imageUrl: null as string | null })),
  ...NEW_RELEASES_ITEMS.map(({ name, creator }) => ({ name, creator, imageUrl: null as string | null })),
  { name: 'Soul Chop 04', creator: 'Vinyl Revival', imageUrl: null as string | null },
  { name: 'Synth Pad Texture', creator: 'Synth Wave', imageUrl: null as string | null },
  { name: '808 Essentials', creator: 'Synth Wave', imageUrl: null as string | null },
  { name: 'Chill Vibes Pack', creator: 'Creator name', imageUrl: null as string | null },
].slice(0, 15);

function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns);
  const result: T[][] = [];
  for (let c = 0; c < columns; c++) {
    result.push(items.slice(c * perColumn, (c + 1) * perColumn));
  }
  return result;
}

export default function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') ?? '';
  const activeTab = (searchParams.get('tab') as (typeof SEARCH_RESULT_TABS)[number]['id']) ?? 'all';

  const samplesRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<HTMLDivElement>(null);
  const creatorsRef = useRef<HTMLDivElement>(null);
  const genresRef = useRef<HTMLDivElement>(null);

  const clearSearch = () => {
    setSearchParams({}, { replace: true });
    navigate('/dashboard');
  };

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null> | undefined> = {
    all: samplesRef,
    samples: samplesRef,
    packs: packsRef,
    creators: creatorsRef,
    genres: genresRef,
  };

  const setTab = (tabId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tabId);
      return next;
    });
    const ref = sectionRefs[tabId]?.current;
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sampleColumns = splitIntoColumns(SEARCH_SAMPLE_ITEMS, 3);
  const resultCount = 1000; // Mock

  return (
    <div className="min-h-screen bg-[#fffbf0] relative">
      <div className="px-8 pt-8 pb-32 w-full max-w-full">
        <div className="max-w-[1376px] mx-auto">
          {/* Tabs – border-b, active: border-b-2 border-black */}
          <div className="border-b border-[#e8e2d2] flex gap-4 items-center mb-8">
            {SEARCH_RESULT_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTab(tab.id)}
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

          {/* Samples section: title + View more + "X results for" + filter chip */}
          <div ref={samplesRef} className="flex flex-col gap-8 mb-8 scroll-mt-4">
            <div className="flex items-start justify-between w-full flex-wrap gap-4">
              <div className="flex gap-6 h-10 items-center">
                <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
                  Samples
                </h2>
                <Link
                  to="/dashboard?tab=samples"
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-[2px] border border-[#a49a84] text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:bg-[#161410]/5 transition-colors"
                >
                  View more
                  <ArrowRight className="size-5 shrink-0" />
                </Link>
              </div>
              <div className="flex gap-3 h-10 items-center">
                <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
                  {resultCount} results for
                </span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-[#161410] text-[#fffbf0] h-10 px-3 rounded-full inline-flex items-center gap-2 text-sm font-medium tracking-[0.1px] hover:opacity-90 transition-opacity"
                  aria-label={`Clear search "${q}"`}
                >
                  <span>{q || 'Search'}</span>
                  <X className="size-5 shrink-0" />
                </button>
              </div>
            </div>

            {/* 3-column sample grid */}
            <div className="flex gap-6 w-full">
              {sampleColumns.map((columnItems, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 min-w-0 border border-[#e8e2d2] rounded-[4px] overflow-hidden flex flex-col"
                >
                  {columnItems.map((item, i) => (
                    <SampleSearchRow
                      key={`${colIndex}-${i}`}
                      name={item.name}
                      creator={item.creator}
                      imageUrl={item.imageUrl}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Packs carousel */}
          <div ref={packsRef} className="mb-8 scroll-mt-4">
            <CardCarousel title="Packs" ctaLabel="View more" onCtaClick={() => navigate('/dashboard?tab=packs')}>
              {FEATURED_PACKS.map((pack) => (
                <SamplePackCard
                  key={pack.title}
                  title={pack.title}
                  creator={pack.creator}
                  playCount={pack.playCount}
                  genre={pack.genre}
                  premium={pack.premium}
                />
              ))}
            </CardCarousel>
          </div>

          {/* Creators carousel */}
          <div ref={creatorsRef} className="mb-8 scroll-mt-4">
            <CardCarousel title="Creators" ctaLabel="View more" onCtaClick={() => navigate('/dashboard?tab=creators')}>
              {FEATURED_CREATORS.map((creator) => (
                <CreatorCard
                  key={creator.name}
                  name={creator.name}
                  followersCount={creator.followersCount}
                  packsCount={creator.packsCount}
                />
              ))}
            </CardCarousel>
          </div>

          {/* Genres carousel */}
          <div ref={genresRef} className="scroll-mt-4">
          <CardCarousel title="Genres" ctaLabel="View more" onCtaClick={() => navigate('/dashboard?tab=genres')}>
            {GENRES_GRID_ITEMS.slice(0, 6).map((genre) => (
              <GenreCard key={genre.name} name={genre.name} imageUrl={genre.imageUrl} />
            ))}
          </CardCarousel>
          </div>
        </div>
      </div>
      <AccessGate />
    </div>
  );
}
