/**
 * Context for Samples filter state shared by desktop and mobile filter bars.
 */
import { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  searchResultCount?: number;
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
    searchResultCount: qFromUrl.trim() ? 1000 : undefined,
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
