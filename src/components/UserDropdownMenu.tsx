import { Link } from 'react-router-dom';
import { User, Settings, LogOut, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MENU_ITEM_CLASS =
  'flex h-10 cursor-pointer items-center gap-1.5 px-3 py-0 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]';
const SECTION_HEADER_CLASS =
  'flex h-6 items-center rounded-xs border border-[#f6f2e6] bg-[#fffbf0] px-3 text-[10px] font-normal uppercase tracking-[1px] text-[#7f7766]';

const TRIGGER_CLASS =
  'border border-[#a49a84] flex items-center justify-center size-10 rounded-xs shrink-0 text-[#161410] hover:bg-[#e8e2d2] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/20 focus-visible:ring-offset-2';

export function UserDropdownMenu({
  onLogout,
  triggerClassName,
}: {
  onLogout?: () => void;
  triggerClassName?: string;
}) {
  const { session } = useAuth();
  const avatarUrl =
    typeof session?.user?.user_metadata?.avatar_url === 'string'
      ? session.user.user_metadata.avatar_url
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClassName ?? TRIGGER_CLASS}
        aria-label="Account menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Your avatar"
            className="size-6 rounded-full object-cover"
          />
        ) : (
          <User className="size-5" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[220px] w-[220px] rounded-[4px] border-[#d6ceb8] bg-white p-0 shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.08)]"
      >
        <div className="py-1">
          <DropdownMenuLabel className={SECTION_HEADER_CLASS}>
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className={`${MENU_ITEM_CLASS} focus:bg-[#f6f2e6]`}>
            <Link to="/dashboard/settings/account" className="flex items-center gap-1.5 text-[#161410]">
              <Settings className="size-5 shrink-0" />
              Account settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={`${MENU_ITEM_CLASS} focus:bg-[#f6f2e6]`}>
            <Link to="/dashboard/settings/bill" className="flex items-center gap-1.5 text-[#161410]">
              <CreditCard className="size-5 shrink-0" />
              Billing
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="my-0 bg-[#d6ceb8]" />
        <div>
          <DropdownMenuItem
            className={MENU_ITEM_CLASS}
            onSelect={async (e) => {
              e.preventDefault();
              await supabase.auth.signOut();
              onLogout?.();
            }}
          >
            <LogOut className="size-5 shrink-0" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
