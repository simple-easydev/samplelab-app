/**
 * Context and hooks for packs filter state shared by mobile and desktop filter bars.
 */
import { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PacksFilterBarMobileProps } from '../pages/dashboard/Packs/PacksFilterBarMobile';

const PacksFilterContext = createContext<PacksFilterBarMobileProps | null>(null);

export function PacksFilterProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortId, setSortId] = useState<PacksFilterBarMobileProps['sortId']>('newest');
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
    setSortId('newest');
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

  const value: PacksFilterBarMobileProps = {
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
    searchResultCount: qFromUrl.trim() ? 1000 : undefined,
  };

  return (
    <PacksFilterContext.Provider value={value}>{children}</PacksFilterContext.Provider>
  );
}

export function usePacksFilterBar(): PacksFilterBarMobileProps {
  const ctx = useContext(PacksFilterContext);
  if (ctx == null) {
    throw new Error('usePacksFilterBar must be used within PacksFilterProvider');
  }
  return ctx;
}
