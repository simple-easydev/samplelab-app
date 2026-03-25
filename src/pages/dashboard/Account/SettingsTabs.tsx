import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const SETTINGS_TABS = [
  { label: 'Account settings', path: '/dashboard/settings/account' },
  { label: 'Billing', path: '/dashboard/settings/bill' },
] as const;

export function SettingsTabs() {
  const { pathname } = useLocation();
  return (
    <div className="border-b border-[#e8e2d2] flex gap-4 items-center w-full shrink-0">
      {SETTINGS_TABS.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.label}
            to={tab.path}
            className={cn(
              'flex h-12 items-center justify-center px-2 shrink-0 font-medium text-base leading-6 whitespace-nowrap transition-colors',
              isActive
                ? 'border-b-2 border-[#161410] text-[#161410]'
                : 'border-b-2 border-transparent text-[#7f7766] hover:text-[#161410]'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
