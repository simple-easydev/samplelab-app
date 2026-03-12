/**
 * Empty state when search returns no results (Figma 849-46430).
 * Icon, "No results found", subtitle, and Browse library / context-specific "Browse all X" actions.
 */
import { useNavigate } from 'react-router-dom';
import { SearchX, ArrowRight } from 'lucide-react';

export interface EmptySearchStateProps {
  /** Secondary button label (e.g. "Browse all samples", "Browse all packs"). Default: "Browse all samples" */
  secondaryLabel?: string;
  /** Path for the secondary button. Default: "/dashboard/samples" */
  secondaryPath?: string;
}

export function EmptySearchState({
  secondaryLabel = 'Browse all samples',
  secondaryPath = '/dashboard/samples',
}: EmptySearchStateProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col gap-6 items-center justify-center py-16 px-4 w-full min-h-[320px]">
      <div className="flex flex-col gap-6 items-center max-w-[442px] w-full text-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="size-12 flex items-center justify-center text-[#5e584b]" aria-hidden>
            <SearchX className="size-12" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <p className="text-[#5e584b] text-2xl font-bold leading-8 tracking-[-0.1px]">
              No results found
            </p>
            <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
              Try a different keyword or browse everything we've got
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap justify-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard/discover')}
            className="bg-[#161410] text-[#fffbf0] h-10 px-3 rounded-xs inline-flex items-center justify-center gap-1.5 text-sm font-medium tracking-[0.1px] hover:opacity-90 transition-opacity"
          >
            Browse library
            <ArrowRight className="size-5 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => navigate(secondaryPath)}
            className="border border-[#a49a84] bg-transparent text-[#161410] h-10 px-3 rounded-xs inline-flex items-center justify-center gap-1.5 text-sm font-medium tracking-[0.1px] hover:bg-[#161410]/5 transition-colors"
          >
            {secondaryLabel}
            <ArrowRight className="size-5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
