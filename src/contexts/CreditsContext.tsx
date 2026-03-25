import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getUserCredits,
  invalidateBillingInfoCache,
} from '@/lib/supabase/subscriptions';

export interface CreditsContextValue {
  credits: number | null;
  /**
   * Refetch balance after something changes it (e.g. download). Invalidates billing cache first.
   * Returns the new credit count.
   */
  refreshCredits: () => Promise<number>;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUserCredits().then((n) => {
      if (!cancelled) setCredits(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshCredits = useCallback(async () => {
    invalidateBillingInfoCache();
    const n = await getUserCredits();
    setCredits(n);
    return n;
  }, []);

  const value = useMemo(
    () => ({ credits, refreshCredits }),
    [credits, refreshCredits]
  );

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCredits(): CreditsContextValue {
  const ctx = useContext(CreditsContext);
  if (!ctx) {
    throw new Error('useCredits must be used within CreditsProvider');
  }
  return ctx;
}
