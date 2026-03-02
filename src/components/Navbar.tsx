import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TryForFreeButton } from '@/components/ui/try-for-free-button';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { useSubscription } from '@/hooks/useSubscription';

const NAV_LINKS = [
  { label: 'Browse', to: '/dashboard' },
  { label: 'How it works', to: '#' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About us', to: '#' },
];

export function Navbar() {
  const [credits, setCredits] = useState<number | null>(null);
  const { isActive, loading } = useSubscription();

  useEffect(() => {
    getUserCredits().then(setCredits);
  }, []);

  const isFreePlan = loading || !isActive;

  return (
    <header className="bg-[#f6f2e6] border-b border-[#e8e2d2] h-20 flex items-center justify-between px-8 w-full shrink-0 z-10">
      <div className="flex gap-8 h-full items-center">
        <Link to="/dashboard" className="h-12 w-36 overflow-hidden shrink-0 flex items-center" aria-label="The Sample Lab home">
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
        <div className="border border-[#d6ceb8] flex h-10 items-center overflow-hidden rounded-[2px] w-[360px] max-w-[360px] bg-transparent px-3">
          <Search className="size-5 shrink-0 text-[#7f7766] mr-2" aria-hidden />
          <Input
            type="search"
            placeholder="Search packs, samples, and creators"
            className="border-0 bg-transparent h-auto py-0 text-sm text-[#161410] placeholder:text-[#7f7766] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
            aria-label="Search packs, samples, and creators"
          />
        </div>
        <div className="flex gap-3 items-center">
          <Link
            to="/dashboard"
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
              to="/dashboard"
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
