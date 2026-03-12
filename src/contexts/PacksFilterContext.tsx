/**
 * Context and hooks for packs filter state shared by mobile and desktop filter bars.
 * Runs get_all_packs with current filters and exposes packs, loading, and result count.
 */
import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PacksFilterBarMobileProps } from '../pages/dashboard/Packs/PacksFilterBarMobile';
import { getAllPacks, type PackRow } from '@/lib/supabase/packs';

const PacksFilterContext = createContext<PacksFilterContextValue | null>(null);

/** Sort id from UI may be trending/random; RPC expects newest, oldest, popular, name-az, name-za */
function mapSortToRpc(sortId: string): string {
  if (sortId === 'trending' || sortId === 'random') return 'newest';
  return sortId;
}

export interface PacksFilterContextValue extends PacksFilterBarMobileProps {
  packs: PackRow[];
  loading: boolean;
}

export function PacksFilterProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<PacksFilterBarMobileProps['sortId']>('trending');
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [keywordSearch, setKeywordSearch] = useState('');
  const [accessId, setAccessId] = useState<PacksFilterBarMobileProps['accessId']>('all');
  const [licenseId, setLicenseId] = useState<PacksFilterBarMobileProps['licenseId']>('all');
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [creatorSearch, setCreatorSearch] = useState('');
  const [releasedId, setReleasedId] = useState<PacksFilterBarMobileProps['releasedId']>('all');

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) next.delete(keyword);
      else next.add(keyword);
      return next;
    });
  };

  const toggleCreator = (creator: string) => {
    setSelectedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creator)) next.delete(creator);
      else next.add(creator);
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setSortId('trending');
    setSelectedGenres(new Set());
    setGenreSearch('');
    setSelectedKeywords(new Set());
    setKeywordSearch('');
    setAccessId('all');
    setLicenseId('all');
    setSelectedCreators(new Set());
    setCreatorSearch('');
    setReleasedId('all');
  };

  const effectiveSearch = qFromUrl.trim() || searchQuery.trim();

  const fetchOptions = useMemo(
    () => ({
      p_search: (qFromUrl.trim() || searchQuery.trim()) || null,
      p_sort: mapSortToRpc(sortId),
      p_genres: selectedGenres.size ? Array.from(selectedGenres) : null,
      p_keywords: selectedKeywords.size ? Array.from(selectedKeywords) : null,
      p_access: accessId === 'regular' ? 'free' : accessId,
      p_license: licenseId,
      p_creators: selectedCreators.size ? Array.from(selectedCreators) : null,
      p_released: releasedId,
      p_limit: null,
      p_offset: 0,
    }),
    [
      qFromUrl,
      searchQuery,
      sortId,
      selectedGenres,
      selectedKeywords,
      accessId,
      licenseId,
      selectedCreators,
      releasedId,
    ]
  );

  const [packs, setPacks] = useState<PackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const optionsRef = useRef(fetchOptions);
  optionsRef.current = fetchOptions;

  const fetchKey = [
    fetchOptions.p_search ?? '',
    fetchOptions.p_sort,
    fetchOptions.p_genres?.slice().sort().join(',') ?? '',
    fetchOptions.p_keywords?.slice().sort().join(',') ?? '',
    fetchOptions.p_access,
    fetchOptions.p_license,
    fetchOptions.p_creators?.slice().sort().join(',') ?? '',
    fetchOptions.p_released,
  ].join('|');

  useEffect(() => {
    let cancelled = false;
    const options = optionsRef.current;
    const run = async () => {
      setLoading(true);
      try {
        const data = await getAllPacks(options);
        if (!cancelled) setPacks(data);
      } catch {
        if (!cancelled) setPacks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const value: PacksFilterContextValue = {
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    sortId,
    onSortIdChange: setSortId,
    selectedGenres,
    onToggleGenre: toggleGenre,
    genreSearch,
    onGenreSearchChange: setGenreSearch,
    selectedKeywords,
    onToggleKeyword: toggleKeyword,
    keywordSearch,
    onKeywordSearchChange: setKeywordSearch,
    accessId,
    onAccessIdChange: setAccessId,
    licenseId,
    onLicenseIdChange: setLicenseId,
    selectedCreators,
    onToggleCreator: toggleCreator,
    creatorSearch,
    onCreatorSearchChange: setCreatorSearch,
    releasedId,
    onReleasedIdChange: setReleasedId,
    onClearAllFilters: handleClearAllFilters,
    showSearchChip: !!qFromUrl.trim(),
    searchChipQuery: qFromUrl.trim() || undefined,
    onClearSearchQuery: qFromUrl.trim()
      ? () =>
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('q');
            return next;
          })
      : undefined,
    searchResultCount: effectiveSearch ? packs.length : undefined,
    packs,
    loading,
  };

  return (
    <PacksFilterContext.Provider value={value}>{children}</PacksFilterContext.Provider>
  );
}

export function usePacksFilterBar(): PacksFilterContextValue {
  const ctx = useContext(PacksFilterContext);
  if (ctx == null) {
    throw new Error('usePacksFilterBar must be used within PacksFilterProvider');
  }
  return ctx;
}
