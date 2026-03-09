/**
 * Reusable sample pack card from Figma (node 812-51974) – Featured Packs section.
 * Cover image, optional Premium badge, overline, title, creator, tag pills.
 * More options button opens context menu – Figma 778-54253.
 * When packId is set, clicking the card navigates to the pack detail page.
 */
import { useNavigate } from 'react-router-dom';
import { Play, MoreHorizontal, Music2, Heart, Download, User, Share2 } from 'lucide-react';
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
}

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
}: SamplePackCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if (!packId) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-dropdown-trigger]') || target.closest('button')) return;
    navigate(`/dashboard/packs/${packId}`);
  };

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
      className={`group bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col gap-2 overflow-hidden pb-4 shrink-0 w-[209px] min-h-[345px] transition-[border-color,box-shadow] duration-200 hover:border-[#d6ceb8] hover:shadow-[0px_2px_6px_0px_rgba(0,0,0,0.06),0px_6px_18px_0px_rgba(0,0,0,0.1)] ${packId ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Cover */}
      <div className="flex flex-col h-[209px] p-2 w-full shrink-0 relative">
        <div className="bg-[#dde1e6] flex-1 min-h-0 overflow-hidden rounded-[2px] w-full relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
          )}
          {/* Hover overlay + play (Figma 778-52064 hover) */}
          <div
            className="absolute inset-0 bg-[#161410] opacity-0 transition-opacity duration-200 group-hover:opacity-50"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#161410]/80 border border-[#e8e2d2]/20">
              <Play className="size-7 text-white fill-white shrink-0" aria-hidden />
            </div>
          </div>
        </div>
        {premium && (
          <div className="absolute top-[10px] right-[10px] bg-[#f3c16c] border border-[#eaaa3e] flex items-center justify-center h-5 px-1.5 rounded-md">
            <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px] uppercase">
              Premium
            </span>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="flex flex-col gap-4 px-4 w-full">
        <div className="flex flex-col gap-1">
          <p className="text-[#7f7766] text-[8px] leading-3 tracking-[1.1px] uppercase">
            Sample pack
          </p>
          <p className="text-[#161410] text-sm font-bold leading-5 tracking-[0.1px] truncate">
            {title}
          </p>
          <p className="text-[#5e584b] text-xs leading-4 tracking-[0.2px] truncate">
            {creator}
          </p>
        </div>

        <div className="border-t border-[#e8e2d2] w-full shrink-0" aria-hidden />

        <div className="flex h-6 items-center justify-between">
          <div className="flex gap-2 items-center">
            {playCount != null && (
              <div className="bg-[#e8e2d2] border border-[#d6ceb8] flex gap-0.5 h-5 items-center justify-center px-1.5 rounded-md shrink-0">
                <Play className="size-3 text-[#161410]" aria-hidden />
                <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                  {playCount}
                </span>
              </div>
            )}
            {genre != null && (
              <div className="bg-[#e8e2d2] border border-[#d6ceb8] flex gap-0.5 h-5 items-center justify-center px-1.5 rounded-md shrink-0">
                <Music2 className="size-3 text-[#161410]" aria-hidden />
                <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                  {genre}
                </span>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              aria-label="More options"
              data-dropdown-trigger
            >
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="size-6 flex items-center justify-center rounded-[2px] text-[#161410] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#e8e2d2] data-[state=open]:opacity-100 data-[state=open]:bg-[#e8e2d2]"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="min-w-[180px] rounded-[2px] border border-[#d6ceb8] bg-white py-1 shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)]"
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
      </div>
    </article>
  );
}
