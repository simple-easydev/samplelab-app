/**
 * Search result page – Figma 821-69479 (Search Result - All).
 * Tabs (All, Packs, Samples, Creators, Genres), samples grid with result count + filter chip,
 * then Packs, Creators, Genres carousels. Uses Supabase RPC search_library.
 */
import { useRef, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { SampleSearchRow } from '@/components/SampleSearchRow';
import { CardCarousel } from '@/components/CardCarousel';
import { SamplePackCard } from '@/components/SamplePackCard';
import { CreatorCard } from '@/components/CreatorCard';
import { GenreCard } from '@/components/GenreCard';
import { searchLibrary, type SearchLibraryResult } from '@/lib/supabase/search';
import { ExploreLibraryCta } from '@/components/ExploreLibraryCta';
import { EmptySearchState } from '@/components/EmptySearchState';

const SEARCH_RESULT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

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

  const [result, setResult] = useState<SearchLibraryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const samplesRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<HTMLDivElement>(null);
  const creatorsRef = useRef<HTMLDivElement>(null);
  const genresRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = q.trim();

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }
    let cancelled = false;
    const p_context = activeTab === 'all' ? undefined : activeTab;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchLibrary(trimmedQuery, { p_context });
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setResult(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [trimmedQuery, activeTab]);

  const clearSearch = () => {
    navigate('/dashboard/discover');
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

  const samples = result?.samples ?? [];
  const packs = result?.packs ?? [];
  const creators = result?.creators ?? [];
  const genres = result?.genres ?? [];
  const totalCount = samples.length + packs.length + creators.length + genres.length;

  const showEmptyState =
    (activeTab === 'all' && totalCount === 0) ||
    (activeTab === 'samples' && samples.length === 0) ||
    (activeTab === 'packs' && packs.length === 0) ||
    (activeTab === 'creators' && creators.length === 0) ||
    (activeTab === 'genres' && genres.length === 0);

  const emptyStateSecondary: Record<(typeof SEARCH_RESULT_TABS)[number]['id'], { label: string; path: string }> = {
    all: { label: 'Browse all samples', path: '/dashboard/samples' },
    samples: { label: 'Browse all samples', path: '/dashboard/samples' },
    packs: { label: 'Browse all packs', path: '/dashboard/packs' },
    creators: { label: 'Browse all creators', path: '/dashboard/creators' },
    genres: { label: 'Browse all genres', path: '/dashboard/genres' },
  };

  const sampleColumns = splitIntoColumns(samples, 3);
  const sampleColumnsMobile = splitIntoColumns(samples, 1);

  const tabUrl = (tabName: string) =>
    trimmedQuery ? `/dashboard?q=${encodeURIComponent(trimmedQuery)}&tab=${tabName}` : `/dashboard`;

  if (!trimmedQuery) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center p-4">
        <p className="text-[#7f7766] text-sm">Enter a search term to find samples, packs, creators, and genres.</p>
      </div>
    );
  }

  if (loading && !result) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center p-4">
        <p className="text-[#7f7766] text-sm">Searching…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center justify-center p-4 gap-4">
        <p className="text-[#161410] text-sm">Search failed. Please try again.</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setLoading(true);
            const p_context = activeTab === 'all' ? undefined : activeTab;
            searchLibrary(trimmedQuery, { p_context })
              .then(setResult)
              .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
              .finally(() => setLoading(false));
          }}
          className="bg-[#161410] text-[#fffbf0] h-10 px-4 rounded-md text-sm font-medium hover:opacity-90"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={clearSearch}
          className="text-[#7f7766] text-sm hover:text-[#161410]"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] relative">
      <div className="p-4 w-full max-w-full md:px-8 md:pt-8 md:pb-32">
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

          {showEmptyState ? (
            <EmptySearchState
              secondaryLabel={emptyStateSecondary[activeTab].label}
              secondaryPath={emptyStateSecondary[activeTab].path}
            />
          ) : (
            <>
          {/* Samples section */}
          <div ref={samplesRef} className="flex flex-col gap-8 mb-8 scroll-mt-4">
            <div className="flex md:hidden items-center justify-end w-full gap-3">
              <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
                {totalCount} results for
              </span>
              <button
                type="button"
                onClick={clearSearch}
                className="bg-[#161410] text-[#fffbf0] h-10 px-3 rounded-full inline-flex items-center gap-2 text-sm font-medium tracking-[0.1px] hover:opacity-90 transition-opacity shrink-0"
                aria-label={`Clear search "${q}"`}
              >
                <span>{q || 'Search'}</span>
                <X className="size-5 shrink-0" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-4">
              <div className="flex gap-6 h-10 items-center w-full md:w-auto justify-between">
                <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
                  Samples
                </h2>
                <Link
                  to={tabUrl('samples')}
                  className="inline-flex items-center gap-1.5 text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:opacity-80 transition-colors md:h-10 md:px-3 md:rounded-xs md:border md:border-[#a49a84] md:hover:bg-[#161410]/5 md:hover:opacity-100"
                >
                  View more
                  <ArrowRight className="size-5 shrink-0" />
                </Link>
              </div>
              <div className="hidden md:flex gap-3 h-10 items-center shrink-0">
                <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
                  {totalCount} results for
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

            {samples.length === 0 ? (
              <EmptySearchState
                secondaryLabel="Browse all samples"
                secondaryPath="/dashboard/samples"
              />
            ) : (
              <>
                <div className="flex flex-col gap-6 w-full md:hidden">
                  {sampleColumnsMobile.map((columnItems, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex-1 min-w-0 border border-[#e8e2d2] rounded-[4px] overflow-hidden flex flex-col"
                    >
                      {columnItems.map((sample) => (
                        <SampleSearchRow
                          key={sample.id}
                          name={sample.name}
                          creator={sample.creator_name}
                          imageUrl={sample.thumbnail_url}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="hidden md:flex gap-6 w-full">
                  {sampleColumns.map((columnItems, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex-1 min-w-0 border border-[#e8e2d2] rounded-[4px] overflow-hidden flex flex-col"
                    >
                      {columnItems.map((sample) => (
                        <SampleSearchRow
                          key={sample.id}
                          name={sample.name}
                          creator={sample.creator_name}
                          imageUrl={sample.thumbnail_url}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Packs carousel */}
          <div ref={packsRef} className="mb-8 scroll-mt-4">
            <CardCarousel title="Packs" ctaLabel="View more" onCtaClick={() => navigate(tabUrl('packs'))}>
              {packs.length === 0 ? (
                <EmptySearchState
                  secondaryLabel="Browse all packs"
                  secondaryPath="/dashboard/packs"
                />
              ) : (
                packs.map((pack) => (
                  <SamplePackCard
                    key={pack.id}
                    pack={{
                      id: pack.id,
                      name: pack.name,
                      creator_name: pack.creator_name,
                      cover_url: pack.cover_url,
                      download_count: pack.download_count,
                      samples_count: pack.samples_count,
                      category_name: pack.category_name,
                      is_premium: pack.is_premium,
                    }}
                    lockDesktop
                  />
                ))
              )}
            </CardCarousel>
          </div>

          {/* Creators carousel */}
          <div ref={creatorsRef} className="mb-8 scroll-mt-4">
            <CardCarousel title="Creators" ctaLabel="View more" onCtaClick={() => navigate(tabUrl('creators'))}>
              {creators.length === 0 ? (
                <EmptySearchState
                  secondaryLabel="Browse all creators"
                  secondaryPath="/dashboard/creators"
                />
              ) : (
                creators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    name={creator.name}
                    creatorId={creator.id}
                    samplesCount={String(creator.samples_count)}
                    packsCount={String(creator.packs_count)}
                    imageUrl={creator.avatar_url ?? undefined}
                    lockDesktop
                  />
                ))
              )}
            </CardCarousel>
          </div>

          {/* Genres carousel */}
          <div ref={genresRef} className="scroll-mt-4">
            <CardCarousel title="Genres" ctaLabel="View more" onCtaClick={() => navigate(tabUrl('genres'))}>
              {genres.length === 0 ? (
                <EmptySearchState
                  secondaryLabel="Browse all genres"
                  secondaryPath="/dashboard/genres"
                />
              ) : (
                genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/dashboard/genres/${genre.id}`}
                    className="contents"
                  >
                    <GenreCard
                      name={genre.name}
                      imageUrl={genre.thumbnail_url ?? undefined}
                      lockDesktop
                    />
                  </Link>
                ))
              )}
            </CardCarousel>
          </div>
            </>
          )}
        </div>
      </div>
      <ExploreLibraryCta />
    </div>
  );
}
