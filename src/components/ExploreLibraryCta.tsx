/**
 * Reusable "Explore the full library" CTA block.
 * Dark background, overline, title, description, and Browse library button.
 * Used on CreatorDetailPage, PackDetailPage, and other detail pages.
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface ExploreLibraryCtaProps {
  /** Optional custom handler for the Browse library button. Defaults to navigating to /dashboard/discover. */
  onBrowseClick?: () => void;
  /** Optional additional class name for the wrapper. */
  className?: string;
}

export function ExploreLibraryCta({ onBrowseClick, className = '' }: ExploreLibraryCtaProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onBrowseClick) {
      onBrowseClick();
    } else {
      navigate('/dashboard/discover');
    }
  };

  return (
    <div
      className={`mt-16 rounded-lg bg-[#26231e] px-8 py-16 flex flex-col items-center gap-6 text-center ${className}`.trim()}
    >
      <p className="text-[#f3c16c] text-lg font-semibold tracking-[0.8px] uppercase">
        Looking for more?
      </p>
      <h2 className="text-[#fffbf0] text-3xl sm:text-4xl font-bold tracking-[-0.6px]">
        Explore the full library
      </h2>
      <p className="text-[#e8e2d2] text-base max-w-xl">
        Browse all packs and samples across genres, moods, and styles
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="border border-[#fffbf0]/30 h-14 px-5 rounded-xs flex items-center gap-2 text-[#fffbf0] text-lg font-medium hover:bg-[#fffbf0]/10 transition-colors"
      >
        Browse library
        <ArrowLeft className="size-7 rotate-180" />
      </button>
    </div>
  );
}
