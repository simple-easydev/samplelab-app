import type { MouseEventHandler } from 'react';
import { Heart, Download, MoreVertical, FolderOpen, User, Share2, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckLightIcon } from './icons';

export type SampleRowActionProps = {
  liked: boolean;
  likeBusy: boolean;
  isDownloaded?: boolean;
  onToggleFavorite: MouseEventHandler<HTMLButtonElement>;
  onOpenDownloadModal: MouseEventHandler<HTMLButtonElement>;
  downloadDisabled: boolean;
  onViewDetails: (event: Event) => void;
  onViewPack: () => void;
  onViewCreator: () => void;
};

export function SampleRowAction({
  liked,
  likeBusy,
  onToggleFavorite,
  onOpenDownloadModal,
  downloadDisabled,
  onViewDetails,
  onViewPack,
  onViewCreator,
  isDownloaded,
}: SampleRowActionProps) {
  // 3 buttons * 36px + 2 gaps * 4px = 116px
  const ACTIONS_WIDTH_CLASS = 'w-[116px]';

  return (
    <div className={['relative shrink-0 h-9', ACTIONS_WIDTH_CLASS].join(' ')}>
      {isDownloaded && (
        <div
          className={[
            'absolute inset-0 hidden md:flex items-center justify-center',
            'opacity-100 transition-opacity duration-200',
            'group-hover:opacity-0',
          ].join(' ')}
        >
          <CheckLightIcon />
        </div>
      )}

      <div
        className={[
          'absolute inset-0 flex gap-1 items-center justify-end',
          // Mobile: always visible (no hover).
          'opacity-100',
          // Desktop: show on hover. If downloaded, hide until hover; otherwise keep previous behavior.
          isDownloaded
            ? 'md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-hover:pointer-events-auto'
            : 'md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-hover:pointer-events-auto',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={likeBusy}
          className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50"
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={liked}
        >
          <Heart className={`size-5 ${liked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={onOpenDownloadModal}
          disabled={downloadDisabled}
          className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Download"
        >
          <Download className="size-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild aria-label="More options">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={4}
            className="min-w-[180px] rounded py-1 border border-[#d6ceb8] bg-white shadow-[0px_6px_20px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)]"
          >
            <DropdownMenuItem
              className="flex md:hidden h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
              onSelect={onViewDetails}
            >
              <BarChart2 className="size-5 shrink-0" aria-hidden />
              View details
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
              onSelect={(e) => {
                e.preventDefault();
                onViewPack();
              }}
            >
              <FolderOpen className="size-5 shrink-0" aria-hidden />
              View pack
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
              onSelect={(e) => {
                e.preventDefault();
                onViewCreator();
              }}
            >
              <User className="size-5 shrink-0" aria-hidden />
              View creator
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
              onSelect={(e) => e.preventDefault()}
            >
              <Share2 className="size-5 shrink-0" aria-hidden />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

