/**
 * Reusable "Explore the full library" CTA block.
 * Dark background, overline, title, description, Browse library button,
 * and a strip of overlapping library cover placeholders.
 * Used on CreatorDetailPage, PackDetailPage, and other detail pages.
 * Design: Figma Platform UX/UI — node 857:69521
 */
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface ExploreLibraryCtaProps {
  /** Optional custom handler for the Browse library button. Defaults to navigating to /dashboard/discover. */
  onBrowseClick?: () => void;
  /** Optional additional class name for the wrapper. */
  className?: string;
}

/** Overlapping library cover strip — placeholder tiles matching Figma layout (CoolGray scale). Desktop: 7 covers, 258px height. Mobile: scaled 7 covers, 140px height. */
function LibraryCoversStrip() {
  const desktopConfig = [
    { size: 182, left: 'calc(50% - 363px)', bg: '#878d96', center: true },
    { size: 182, left: 'calc(50% + 363px)', bg: '#878d96', center: true },
    { size: 209, left: 'calc(50% + 257.5px)', bg: '#a2a9b0', center: true },
    { size: 209, left: 'calc(50% - 257.5px)', bg: '#a2a9b0', center: true },
    { size: 234, left: 'calc(50% + 128px)', bg: '#c1c7cd', center: true },
    { size: 234, left: 'calc(50% - 129px)', bg: '#c1c7cd', center: true },
    { size: 258, left: '50%', bg: '#dde1e6', center: true },
  ];

  /** Mobile: same 7-cover layout scaled to fit narrow viewport (~140px height, positions scaled). */
  const mobileConfig = [
    { size: 98, left: 'calc(50% - 158px)', bg: '#878d96', center: true },
    { size: 98, left: 'calc(50% + 158px)', bg: '#878d96', center: true },
    { size: 112, left: 'calc(50% + 111px)', bg: '#a2a9b0', center: true },
    { size: 112, left: 'calc(50% - 111px)', bg: '#a2a9b0', center: true },
    { size: 126, left: 'calc(50% + 55px)', bg: '#c1c7cd', center: true },
    { size: 126, left: 'calc(50% - 56px)', bg: '#c1c7cd', center: true },
    { size: 140, left: '50%', bg: '#dde1e6', center: true },
  ];

  const stripContent = (config: typeof desktopConfig, height: number) => (
    <div className="relative w-full h-full" style={{ height }} aria-hidden>
      {config.map(({ size, left, bg, center }, idx) => (
        <div
          key={idx}
          className="absolute bottom-0 overflow-hidden rounded-t-sm"
          style={{
            width: size,
            height: size,
            left,
            transform: center ? 'translateX(-50%)' : undefined,
            backgroundColor: bg,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: scaled strip — fixed width so 50% / right:0 center correctly */}
      <div className="md:hidden w-full flex justify-center px-4">
        <div className="w-[414px] max-w-full" style={{ height: 140 }}>
          {stripContent(mobileConfig, 140)}
        </div>
      </div>
      {/* Desktop: fixed 910px width so strip is symmetric and centered */}
      <div className="hidden md:flex md:justify-center w-full">
        <div className="w-[910px]" style={{ height: 258 }}>
          {stripContent(desktopConfig, 258)}
        </div>
      </div>
    </>
  );
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
      className={`mt-16 bg-[#26231e] flex flex-col items-center gap-16 pt-32 pb-0 px-8 text-center ${className}`.trim()}
    >
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col gap-5 items-center text-center w-full max-w-[676px]">
          <div className="flex flex-col gap-4 w-full">
            <p className="text-[#f3c16c] text-lg font-semibold tracking-[0.8px] uppercase leading-6">
              Looking for more?
            </p>
            <h2 className="text-[#fffbf0] text-[48px] font-bold leading-[56px] tracking-[-0.6px]">
              Explore the full library
            </h2>
          </div>
          <p className="text-[#e8e2d2] text-base leading-6 w-full">
            Browse all packs and samples across genres, moods, and styles
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="border border-[#fffbf0]/30 h-14 px-5 rounded-xs flex items-center justify-center gap-2 text-[#fffbf0] text-lg font-medium hover:bg-[#fffbf0]/10 transition-colors"
        >
          Browse library
          <ArrowRight className="size-7 shrink-0" aria-hidden />
        </button>
      </div>
      <LibraryCoversStrip />
    </div>
  );
}
