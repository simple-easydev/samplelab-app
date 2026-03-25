/**
 * Context for Samples filter state shared by desktop and mobile filter bars.
 * Runs get_all_samples with current filters and exposes samples, loading, and result count.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllSamples, type SampleItem } from '@/lib/supabase/samples';

/** First page and each "infinite scroll" chunk size (RPC `p_limit` / `p_offset`). */
export const SAMPLES_PAGE_SIZE = 30;

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most popular' },
  { id: 'name-az', label: 'Name A–Z' },
  { id: 'name-za', label: 'Name Z–A' },
] as const;

export type SamplesSortId = (typeof SORT_OPTIONS)[number]['id'];

export interface SamplesFilterContextValue {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortId: SamplesSortId;
  onSortIdChange: (id: SamplesSortId) => void;
  selectedGenres: Set<string>;
  onToggleGenre: (genre: string) => void;
  genreSearch: string;
  onGenreSearchChange: (value: string) => void;
  selectedKeywords: Set<string>;
  onToggleKeyword: (keyword: string) => void;
  keywordSearch: string;
  onKeywordSearchChange: (value: string) => void;
  instrumentId: string;
  onInstrumentIdChange: (id: string) => void;
  typeId: string;
  onTypeIdChange: (id: string) => void;
  stemsId: string;
  onStemsIdChange: (id: string) => void;
  selectedKeys: Set<string>;
  onToggleKey: (keyName: string) => void;
  keyQuality: string;
  onKeyQualityChange: (id: string) => void;
  bpmTab: 'range' | 'exact';
  onBpmTabChange: (tab: 'range' | 'exact') => void;
  bpmRangeMin: number;
  bpmRangeMax: number;
  onBpmRangeChange: (min: number, max: number) => void;
  bpmExact: string;
  onBpmExactChange: (value: string) => void;
  onClearAllFilters: () => void;
  showSearchChip?: boolean;
  searchChipQuery?: string;
  onClearSearchQuery?: () => void;
  /** Shown in search chip; when `searchResultHasMore`, count displays as "N+". */
  searchResultCount?: number;
  searchResultHasMore?: boolean;
  samples: SampleItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

const SamplesFilterContext = createContext<SamplesFilterContextValue | null>(null);

const BPM_MIN = 0;
const BPM_MAX = 240;

export function SamplesFilterProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<SamplesSortId>('newest');
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [genreSearch, setGenreSearch] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [keywordSearch, setKeywordSearch] = useState('');
  const [instrumentId, setInstrumentId] = useState('all');
  const [typeId, setTypeId] = useState('all');
  const [stemsId, setStemsId] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [keyQuality, setKeyQuality] = useState('all');
  const [bpmTab, setBpmTab] = useState<'range' | 'exact'>('range');
  const [bpmRangeMin, setBpmRangeMin] = useState(BPM_MIN);
  const [bpmRangeMax, setBpmRangeMax] = useState(BPM_MAX);
  const [bpmExact, setBpmExact] = useState('');

  const onToggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  };

  const onToggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) next.delete(keyword);
      else next.add(keyword);
      return next;
    });
  };

  const onToggleKey = (keyName: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyName)) next.delete(keyName);
      else next.add(keyName);
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setSortId('newest');
    setSelectedGenres(new Set());
    setGenreSearch('');
    setSelectedKeywords(new Set());
    setKeywordSearch('');
    setInstrumentId('all');
    setTypeId('all');
    setStemsId('all');
    setSelectedKeys(new Set());
    setKeyQuality('all');
    setBpmTab('range');
    setBpmRangeMin(BPM_MIN);
    setBpmRangeMax(BPM_MAX);
    setBpmExact('');
  };

  const effectiveSearch = qFromUrl.trim() || searchQuery.trim();
  const bpmExactNum = bpmTab === 'exact' && bpmExact.trim() !== '' ? parseInt(bpmExact, 10) : null;
  const validBpmExact = bpmExactNum !== null && !Number.isNaN(bpmExactNum) ? bpmExactNum : null;

  const fetchOptions = useMemo(
    () => ({
      p_search: effectiveSearch || null,
      p_sort: sortId,
      p_genres: selectedGenres.size ? Array.from(selectedGenres) : null,
      p_keywords: selectedKeywords.size ? Array.from(selectedKeywords) : null,
      p_instrument: instrumentId,
      p_type: typeId,
      p_stems: stemsId,
      p_keys: selectedKeys.size ? Array.from(selectedKeys) : null,
      p_key_quality: keyQuality,
      p_bpm_min: validBpmExact != null ? null : bpmRangeMin,
      p_bpm_max: validBpmExact != null ? null : bpmRangeMax,
      p_bpm_exact: validBpmExact,
    }),
    [
      qFromUrl,
      searchQuery,
      sortId,
      selectedGenres,
      selectedKeywords,
      instrumentId,
      typeId,
      stemsId,
      selectedKeys,
      keyQuality,
      validBpmExact,
      bpmRangeMin,
      bpmRangeMax,
    ]
  );

  const [samples, setSamples] = useState<SampleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const optionsRef = useRef(fetchOptions);
  optionsRef.current = fetchOptions;
  const filterEpochRef = useRef(0);
  const loadMoreInFlightRef = useRef(false);

  const fetchKey = [
    fetchOptions.p_search ?? '',
    fetchOptions.p_sort,
    fetchOptions.p_genres?.slice().sort().join(',') ?? '',
    fetchOptions.p_keywords?.slice().sort().join(',') ?? '',
    fetchOptions.p_instrument,
    fetchOptions.p_type,
    fetchOptions.p_stems,
    fetchOptions.p_keys?.slice().sort().join(',') ?? '',
    fetchOptions.p_key_quality,
    fetchOptions.p_bpm_min,
    fetchOptions.p_bpm_max,
    fetchOptions.p_bpm_exact,
  ].join('|');

  useEffect(() => {
    let cancelled = false;
    filterEpochRef.current += 1;
    const epoch = filterEpochRef.current;
    const run = async () => {
      setLoading(true);
      setSamples([]);
      setHasMore(true);
      try {
        const data = await getAllSamples({
          ...optionsRef.current,
          p_limit: SAMPLES_PAGE_SIZE,
          p_offset: 0,
        });
        if (cancelled || epoch !== filterEpochRef.current) return;
        setSamples(data);
        setHasMore(data.length === SAMPLES_PAGE_SIZE);
      } catch {
        if (!cancelled && epoch === filterEpochRef.current) {
          setSamples([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled && epoch === filterEpochRef.current) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || loadMoreInFlightRef.current) return;
    const epoch = filterEpochRef.current;
    const offset = samples.length;
    loadMoreInFlightRef.current = true;
    setLoadingMore(true);
    try {
      const data = await getAllSamples({
        ...optionsRef.current,
        p_limit: SAMPLES_PAGE_SIZE,
        p_offset: offset,
      });
      if (epoch !== filterEpochRef.current) return;
      setSamples((prev) => [...prev, ...data]);
      setHasMore(data.length === SAMPLES_PAGE_SIZE);
    } catch {
      if (epoch === filterEpochRef.current) setHasMore(false);
    } finally {
      loadMoreInFlightRef.current = false;
      if (epoch === filterEpochRef.current) setLoadingMore(false);
    }
  }, [loading, hasMore, samples.length]);

  const value: SamplesFilterContextValue = {
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    sortId,
    onSortIdChange: setSortId,
    selectedGenres,
    onToggleGenre: onToggleGenre,
    genreSearch,
    onGenreSearchChange: setGenreSearch,
    selectedKeywords,
    onToggleKeyword: onToggleKeyword,
    keywordSearch,
    onKeywordSearchChange: setKeywordSearch,
    instrumentId,
    onInstrumentIdChange: setInstrumentId,
    typeId,
    onTypeIdChange: setTypeId,
    stemsId,
    onStemsIdChange: setStemsId,
    selectedKeys,
    onToggleKey: onToggleKey,
    keyQuality,
    onKeyQualityChange: setKeyQuality,
    bpmTab,
    onBpmTabChange: setBpmTab,
    bpmRangeMin,
    bpmRangeMax,
    onBpmRangeChange: (min, max) => {
      setBpmRangeMin(min);
      setBpmRangeMax(max);
    },
    bpmExact,
    onBpmExactChange: setBpmExact,
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
    searchResultCount: effectiveSearch ? samples.length : undefined,
    searchResultHasMore: effectiveSearch ? hasMore : undefined,
    samples,
    loading,
    loadingMore,
    hasMore,
    loadMore,
  };

  return (
    <SamplesFilterContext.Provider value={value}>{children}</SamplesFilterContext.Provider>
  );
}

export function useSamplesFilterBar(): SamplesFilterContextValue {
  const ctx = useContext(SamplesFilterContext);
  if (ctx == null) {
    throw new Error('useSamplesFilterBar must be used within SamplesFilterProvider');
  }
  return ctx;
}
