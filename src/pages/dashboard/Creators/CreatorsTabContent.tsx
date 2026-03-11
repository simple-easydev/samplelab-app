/**
 * Creators tab – Figma 812-85001.
 * Filter bar (Trending, Popular, Recent, A-Z), search, and grid of CreatorCards.
 * When URL has ?q=..., shows SearchQueryChip instead of the search input.
 * Data from Supabase RPC get_creators_with_counts (creators joined with packs/samples counts).
 */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AccessGate } from '@/components/AccessGate';
import { CreatorCard } from '@/components/CreatorCard';
import { useSubscription } from '@/hooks/useSubscription';
import { getCreatorsWithCounts } from '@/lib/supabase/creators';
import { CreatorsFilterBar } from './CreatorsFilterBar';

export function CreatorsTabContent() {
  const { isActive } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [sortId, setSortId] = useState<string>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [creators, setCreators] = useState<Awaited<ReturnType<typeof getCreatorsWithCounts>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getCreatorsWithCounts({ p_search: qFromUrl.trim() || searchQuery.trim() || undefined })
      .then((data) => {
        if (!cancelled) {
          setCreators(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [qFromUrl, searchQuery]);

  const filteredCreators = useMemo(() => {
    const list = [...creators];
    if (sortId === 'a-z') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [creators, sortId]);

  return (
    <div className="mb-8 flex flex-col gap-8 relative">
      {!isActive && <AccessGate />}

      <div className="flex flex-col gap-8">
        <CreatorsFilterBar
          sortId={sortId}
          onSortIdChange={setSortId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          qFromUrl={qFromUrl}
          onClearSearch={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('q');
              return next;
            });
          }}
          resultCount={filteredCreators.length}
        />

        {/* Creator cards grid – 2 cols mobile, gap 24px */}
        <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <p className="text-[#5e584b] text-sm">Loading creators…</p>
          ) : (
            filteredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creatorId={creator.id}
                name={creator.name}
                samplesCount={String(creator.samples_count)}
                packsCount={String(creator.packs_count)}
                imageUrl={creator.avatar_url ?? undefined}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
