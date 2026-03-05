/**
 * Access gate for non-subscribed users – Figma 773-51263.
 * Full-bleed gradient background with a single centered CTA button:
 * lock icon + "Subscribe for full access" (bg #161410, 2px radius, 56px height).
 */
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export interface AccessGateProps {
  /** Button label. Default: "Subscribe for full access" per Figma. */
  label?: string;
}

export function AccessGate({ label = 'Subscribe for full access' }: AccessGateProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-[#fffbf0] from-40% to-transparent pt-12 pb-6 px-4"
      data-name="access-gate"
      role="region"
      aria-label="Subscribe to access"
    >
      <Link
        to="/pricing"
        className="flex h-14 shrink-0 items-center justify-center gap-2.5 overflow-clip rounded-xs bg-[#161410] px-5 transition-colors hover:bg-[#161410]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161410]/30"
        data-name="button"
      >
        <Lock
          className="size-7 shrink-0 text-[#fffbf0]"
          strokeWidth={2}
          aria-hidden
        />
        <span className="font-medium text-[#fffbf0] text-lg leading-7 whitespace-nowrap">
          {label}
        </span>
      </Link>
    </div>
  );
}
