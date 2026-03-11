/**
 * Reusable sample pack card – Featured Packs section.
 * Desktop: vertical card (Figma 812-51974). Mobile: horizontal card (Figma 1462-156772).
 * Cover image, optional Premium badge, overline, title, creator, tag pills.
 * More options button opens context menu. When packId is set, clicking the card navigates to the pack detail page.
 */
import { useNavigate } from 'react-router-dom';
import { Play, MoreHorizontal, Music2, Heart, Download, User, Share2, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SamplePackCardProps {
  title: string;
  creator: string;
  /** When set, clicking the card navigates to /dashboard/packs/:packId */
  packId?: string;
  /** e.g. play count "20" */
  playCount?: string;
  /** e.g. "Hip-Hop" */
  genre?: string;
  premium?: boolean;
  /** Optional image URL; placeholder used if not provided */
  imageUrl?: string;
  /** Optional callbacks for context menu actions */
  onAddToFavorites?: () => void;
  onGetPack?: () => void;
  onViewCreator?: () => void;
  onShare?: () => void;
  /** When true, always use desktop card style (vertical layout, fixed size) on all viewports including mobile. */
  lockDesktop?: boolean;
}

const cardBase =
  'group bg-[#f6f2e6] border border-[#e8e2d2] rounded overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[#d6ceb8] hover:shadow-[0px_2px_6px_0px_rgba(0,0,0,0.06),0px_6px_18px_0px_rgba(0,0,0,0.1)]';

const tagPill =
  'bg-[#e8e2d2] border border-[#d6ceb8] flex gap-0.5 h-5 items-center justify-center px-1.5 rounded-md shrink-0';

export function SamplePackCard({
  title,
  creator,
  packId,
  playCount,
  genre,
  premium = false,
  imageUrl,
  onAddToFavorites,
  onGetPack,
  onViewCreator,
  onShare,
  lockDesktop = false,
}: SamplePackCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if (!packId) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-dropdown-trigger]') || target.closest('button')) return;
    navigate(`/dashboard/packs/${packId}`);
  };

  const moreButtonClass =
    'size-6 flex items-center justify-center rounded-xs text-[#161410] opacity-100 transition-opacity hover:bg-[#e8e2d2] data-[state=open]:opacity-100 data-[state=open]:bg-[#e8e2d2] md:opacity-0 md:group-hover:opacity-100';

  const premiumBadgeDesktop = premium ? (
    <div className="absolute top-[10px] right-[10px] bg-[#f3c16c] border border-[#eaaa3e] flex items-center justify-center h-5 px-1.5 rounded-md">
      <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px] uppercase">
        Premium
      </span>
    </div>
  ) : null;

  const premiumBadgeMobile = premium ? (
    <div className="absolute top-2 right-2 bg-[#f3c16c] border border-[#eaaa3e] flex items-center justify-center size-5 rounded-md">
      <Crown className="size-3 text-[#161410]" aria-hidden />
    </div>
  ) : null;

  const coverImage = (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
      )}
      <div
        className="absolute inset-0 bg-[#161410] opacity-0 transition-opacity duration-200 group-hover:opacity-50 max-md:hidden md:block"
        aria-hidden
      />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none max-md:hidden md:flex items-center justify-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
          <Play className="size-7 text-white fill-white shrink-0" aria-hidden />
        </div>
      </div>
    </>
  );

  const textBlock = (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <p className="text-[#7f7766] text-[8px] leading-3 tracking-[1.1px] uppercase">Sample pack</p>
      <p className="text-[#161410] text-sm font-bold leading-5 tracking-[0.1px] truncate">
        {title}
      </p>
      <p className="text-[#5e584b] text-xs leading-4 tracking-[0.2px] truncate">{creator}</p>
    </div>
  );

  const tagsAndMenu = (
    <div className="flex h-6 items-center justify-between shrink-0">
      <div className="flex gap-2 items-center min-w-0">
        {playCount != null && (
          <div className={tagPill}>
            <Play className="size-3 text-[#161410] shrink-0" aria-hidden />
            <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
              {playCount}
            </span>
          </div>
        )}
        {genre != null && (
          <div className={tagPill}>
            <Music2 className="size-3 text-[#161410] shrink-0 hidden md:block" aria-hidden />
            <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
              {genre}
            </span>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="More options" data-dropdown-trigger>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className={moreButtonClass}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="min-w-[180px] rounded-xs border border-[#d6ceb8] bg-white py-1 shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)]"
        >
          <DropdownMenuItem
            className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
            onSelect={(e) => {
              e.preventDefault();
              onAddToFavorites?.();
            }}
          >
            <Heart className="size-5 shrink-0" aria-hidden />
            Add to favorites
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
            onSelect={(e) => {
              e.preventDefault();
              onGetPack?.();
            }}
          >
            <Download className="size-5 shrink-0" aria-hidden />
            Get pack
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
            onSelect={(e) => {
              e.preventDefault();
              onViewCreator?.();
            }}
          >
            <User className="size-5 shrink-0" aria-hidden />
            View creator
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
            onSelect={(e) => {
              e.preventDefault();
              onShare?.();
            }}
          >
            <Share2 className="size-5 shrink-0" aria-hidden />
            Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <article
      role={packId ? 'button' : undefined}
      tabIndex={packId ? 0 : undefined}
      onClick={packId ? handleCardClick : undefined}
      onKeyDown={
        packId
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/dashboard/packs/${packId}`);
              }
            }
          : undefined
      }
      className={`${cardBase} ${packId ? 'cursor-pointer' : 'cursor-default'} flex flex-col gap-2 pb-4 shrink-0 rounded-md
        ${lockDesktop
          ? 'w-[209px] min-h-[345px]'
          : 'w-full min-h-[160px] md:w-[209px] md:min-h-[345px]'
        }`}
    >
      {/* Mobile: horizontal — cover left, data right (only when not lockDesktop, hidden from md up) */}
      {!lockDesktop && (
      <div className="flex flex-row gap-2 p-2 items-stretch w-full md:hidden">
        <div className="flex flex-col shrink-0 relative">
          <div className="bg-[#dde1e6] size-[128px] overflow-hidden rounded-xs relative">
            {coverImage}
            {premiumBadgeMobile}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0 py-4 pr-4 pl-0">
          {textBlock}
          <div className="border-t border-[#e8e2d2] w-full shrink-0 pb-2" aria-hidden />
          {tagsAndMenu}
        </div>
      </div>
      )}
      {/* Desktop: vertical — cover top, data below (always when lockDesktop; from md up when responsive) */}
      <div className={`flex flex-col gap-2 w-full h-full ${lockDesktop ? '' : 'hidden md:flex'}`}>
        <div className="flex flex-col h-[209px] p-2 w-full shrink-0 relative">
          <div className="bg-[#dde1e6] flex-1 min-h-0 overflow-hidden rounded-xs w-full relative">
            {coverImage}
          </div>
          {premiumBadgeDesktop}
        </div>
        <div className="flex flex-col gap-4 px-4 w-full">
          {textBlock}
          <div className="border-t border-[#e8e2d2] w-full shrink-0" aria-hidden />
          {tagsAndMenu}
        </div>
      </div>
    </article>
  );
}
