import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { UserDropdownMenu } from '@/components/UserDropdownMenu';
import { TryForFreeButton } from '@/components/ui/try-for-free-button';
import { useCredits } from '@/contexts/CreditsContext';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { CoinsStack } from '@/components/icons';

const NAV_LINKS = [
  { label: 'Browse', to: '/dashboard/discover' },
  { label: 'How it works', to: '#' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About us', to: '#' },
];

export function Navbar() {
  const { credits } = useCredits();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const { isActive, loading } = useSubscription();

  const isFreePlan = loading || !isActive;

  return (
    <header className="bg-[#f6f2e6] border-b border-[#e8e2d2] w-full shrink-0 z-10">
      {/* Desktop: single row */}
      <div className="hidden md:flex h-20 items-center justify-between px-8">
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
            key={searchQuery}
            searchQuery={searchQuery}
            onSuggestionSelect={(term, section) => {
              const url = section === 'genres'
                ? `/dashboard?q=${encodeURIComponent(term)}&tab=genres`
                : `/dashboard?q=${encodeURIComponent(term)}`;
              navigate(url);
            }}
            onSearch={(q) => q && navigate(`/dashboard?q=${encodeURIComponent(q)}`)}
          />
          <div className="flex gap-3 items-center">
            <UserDropdownMenu />
            {isFreePlan ? (
              <TryForFreeButton asChild className="h-10 min-w-[100px]">
                <Link to="/pricing">Subscribe</Link>
              </TryForFreeButton>
            ) : (
              <Link
                to="/dashboard/discover"
                className="border border-[#a49a84] flex h-10 items-center justify-center px-3 rounded-xs text-[#161410] text-sm font-medium tracking-[0.1px] hover:bg-[#e8e2d2] transition-colors"
              >
                {credits != null ? `Credits: ${credits}` : 'Credits'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: two rows — logo+burger | user+credits; then full-width search */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex gap-3 items-center min-w-0">
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="left">
              <DrawerTrigger
                className="size-6 shrink-0 flex items-center justify-center text-[#161410] rounded-xs hover:bg-[#e8e2d2] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/20 focus-visible:ring-offset-2"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </DrawerTrigger>
              <DrawerContent className="p-0 max-w-[85vw] w-[280px]">
                <DrawerHeader className="flex flex-row items-center justify-between border-b border-[#e8e2d2] py-3 px-4">
                  <DrawerTitle className="text-sm font-semibold text-[#161410]">
                    Menu
                  </DrawerTitle>
                  <DrawerClose
                    className="size-8 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col py-2" aria-label="Main">
                  {NAV_LINKS.map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-12 items-center px-4 text-[#161410] text-base font-medium leading-6 hover:bg-[#e8e2d2] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
            <Link to="/dashboard/discover" className="h-9 w-[108px] overflow-hidden shrink-0 flex items-center" aria-label="The Sample Lab home">
              <img src="/logo.svg" alt="The Sample Lab" className="h-full w-full object-contain" />
            </Link>
          </div>
          <div className="flex gap-3 items-center shrink-0">
            <UserDropdownMenu
              triggerClassName="border border-[#a49a84] flex items-center justify-center size-8 rounded-xs shrink-0 text-[#161410] hover:bg-[#e8e2d2] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/20 focus-visible:ring-offset-2 [&_svg]:size-4"
            />
            {isFreePlan ? (
              <TryForFreeButton asChild className="h-8 min-w-0 px-2 text-xs font-medium">
                <Link to="/pricing">Subscribe</Link>
              </TryForFreeButton>
            ) : (
              <Link
                to="/dashboard/discover"
                className="border border-[#a49a84] flex h-8 items-center justify-center gap-1 px-2 rounded-xs text-[#161410] text-xs font-medium tracking-[0.2px] hover:bg-[#e8e2d2] transition-colors"
              >
                <CoinsStack className="size-4 shrink-0" />
                <span>{credits != null ? credits : '—'}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="px-4 pb-3">
          <SearchBar
            key={searchQuery}
            className="w-full max-w-none"
            searchQuery={searchQuery}
            onSuggestionSelect={(term, section) => {
              const url = section === 'genres'
                ? `/dashboard?q=${encodeURIComponent(term)}&tab=genres`
                : `/dashboard?q=${encodeURIComponent(term)}`;
              navigate(url);
            }}
            onSearch={(q) => q && navigate(`/dashboard?q=${encodeURIComponent(q)}`)}
          />
        </div>
      </div>
    </header>
  );
}
