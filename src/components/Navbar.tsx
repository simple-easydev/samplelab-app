import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { TryForFreeButton } from '@/components/ui/try-for-free-button';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { useSubscription } from '@/hooks/useSubscription';

const NAV_LINKS = [
  { label: 'Browse', to: '/dashboard/discover' },
  { label: 'How it works', to: '#' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About us', to: '#' },
];

export function Navbar() {
  const [credits, setCredits] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isActive, loading, subscription } = useSubscription();
  console.log({ subscription})

  useEffect(() => {
    getUserCredits().then(setCredits);
  }, []);

  const isFreePlan = loading || !isActive;

  return (
    <header className="bg-[#f6f2e6] border-b border-[#e8e2d2] h-20 flex items-center justify-between px-8 w-full shrink-0 z-10">
      <div className="flex gap-8 h-full items-center">
        <Link to="/dashboard/discover" className="h-12 w-36 overflow-hidden shrink-0 flex items-center" aria-label="The Sample Lab home">
          <img src="/logo.svg" alt="The Sample Lab" className="h-full w-full object-contain" />
        </Link>
        <nav className="flex gap-4 items-center" aria-label="Main">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex h-12 items-center justify-center px-2 text-[#7f7766] text-base font-medium leading-6 whitespace-nowrap hover:text-[#161410] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex gap-6 items-center">
        <SearchBar
          onSuggestionSelect={(term) => navigate(`/dashboard?q=${encodeURIComponent(term)}`)}
          onSearch={(q) => q && navigate(`/dashboard?q=${encodeURIComponent(q)}`)}
        />
        <div className="flex gap-3 items-center">
          <Link
            to="/dashboard/discover"
            className="border border-[#a49a84] flex items-center justify-center size-10 rounded-[2px] shrink-0 text-[#161410] hover:bg-[#e8e2d2] transition-colors"
            aria-label="Account"
          >
            <User className="size-5" />
          </Link>
          {isFreePlan ? (
            <TryForFreeButton asChild className="h-10 min-w-[100px]">
              <Link to="/pricing">Subscribe</Link>
            </TryForFreeButton>
          ) : (
            <Link
              to="/dashboard/discover"
              className="border border-[#a49a84] flex h-10 items-center justify-center px-3 rounded-[2px] text-[#161410] text-sm font-medium tracking-[0.1px] hover:bg-[#e8e2d2] transition-colors"
            >
              {credits != null ? `Credits: ${credits}` : 'Credits'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
