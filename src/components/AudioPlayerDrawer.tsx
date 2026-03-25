import { useMemo, useState } from 'react';
import { Download, Heart, MoreHorizontal, Pause, Play, Repeat, Share2, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface PackPreviewDrawerPack {
  kind?: 'pack' | 'sample';
  id: string;
  name: string;
  creatorName: string;
  coverUrl?: string | null;
  samplesCount?: number | null;
}

interface PackPreviewPlayerDrawerProps {
  pack: PackPreviewDrawerPack;
  isPlaying: boolean;
  volumePercent: number; // 0..100
  onSetVolumePercent: (next: number) => void;
  isRepeatOn: boolean;
  progressPercent: number;
  previewTime: string;
  onTogglePlayPause: () => void;
  onToggleRepeat: () => void;
  onViewPack: () => void;
  onGetPack: () => void;
  onViewCreator: () => void;
  onShare: () => void;
}

export function AudioPlayerDrawer({
  pack,
  isPlaying,
  volumePercent,
  onSetVolumePercent,
  isRepeatOn,
  progressPercent,
  previewTime,
  onTogglePlayPause,
  onToggleRepeat,
  onViewPack,
  onGetPack,
  onViewCreator,
  onShare,
}: PackPreviewPlayerDrawerProps) {
  const previewKind = pack.kind ?? 'pack';
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const volumeLabel = useMemo(() => `${Math.round(volumePercent)}%`, [volumePercent]);

  return (
    <div className="fixed left-0 bottom-0 w-screen z-40 border-t border-[#d6ceb8] bg-[#fffbf0] p-0 shadow-[0px_-8px_24px_0px_rgba(0,0,0,0.1),0px_-2px_4px_0px_rgba(0,0,0,0.04)]">
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 h-[4px] bg-[#e8e2d2]" aria-hidden>
          <div className="h-full bg-[#161410]" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="hidden md:flex items-center gap-6 px-6 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xs bg-white">
              {pack.coverUrl ? (
                <img src={pack.coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-5 tracking-[0.1px] text-[#161410]">{pack.name}</p>
              <p className="truncate text-xs leading-4 tracking-[0.2px] text-[#5e584b]">
                {pack.creatorName}
                {pack.samplesCount != null ? ` • ${pack.samplesCount} Samples` : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onTogglePlayPause}
              className="flex size-10 items-center justify-center rounded-full border border-[#d6ceb8] bg-[#161410] text-[#fffbf0]"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current pl-0.5" />}
            </button>
            <p className="text-xs leading-4 tracking-[0.2px] text-[#5e584b]">Preview • {previewTime}</p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-5 text-[#161410]">
            <button
              type="button"
              onClick={onToggleRepeat}
              className={`inline-flex size-6 items-center justify-center rounded-xs ${isRepeatOn ? 'bg-[#e8e2d2]' : ''}`}
              aria-label={isRepeatOn ? 'Disable repeat' : 'Enable repeat'}
              aria-pressed={isRepeatOn}
            >
              <Repeat className="size-5" aria-hidden />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVolumeOpen((v) => !v)}
                aria-label="Volume"
                aria-pressed={isVolumeOpen}
                className="rounded-xs size-6 flex items-center justify-center text-[#161410] hover:bg-[#e8e2d2]"
              >
                <Volume2 className="size-5" aria-hidden />
              </button>
              {isVolumeOpen && (
                <div
                  className="absolute bottom-full mb-2 right-0 bg-white border border-[#d6ceb8] rounded-[4px] shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.08)] w-[40px] h-[120px] p-[12px] flex items-end justify-center"
                  style={
                    {
                      backgroundColor: 'white',
                      // Make shadcn Slider colors match the player palette.
                      ['--primary' as any]: '#161410',
                      ['--muted' as any]: 'rgba(214,206,184,0.35)',
                      ['--ring' as any]: 'rgba(214,206,184,0)',
                    } as any
                  }
                >
                  <div className="relative flex w-full h-[96px] items-center justify-center overflow-hidden">
                    {/* Slider line + thumb rendered via shadcn/radix (no Figma images). */}
                    <Slider
                      orientation="vertical"
                      min={0}
                      max={100}
                      value={[volumePercent]}
                      onValueChange={(v) => onSetVolumePercent(v[0] ?? 0)}
                      className="h-[80px]! min-h-0! w-2 **:data-[slot=slider-track]:w-[4px]! **:data-[slot=slider-thumb]:size-3! **:data-[slot=slider-thumb]:shadow-none! **:data-[slot=slider-thumb]:ring-0! **:data-[slot=slider-thumb]:hover:ring-0! **:data-[slot=slider-thumb]:focus-visible:ring-0!"
                    />
                  </div>
                  <span className="sr-only">{`Volume ${volumeLabel}`}</span>
                </div>
              )}
            </div>
            <Heart className="size-5" aria-hidden />
            {previewKind === 'pack' && (
              <Button variant="outline" onClick={onViewPack}>
                View Pack
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild aria-label="More options">
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors"
                >
                  <MoreHorizontal className="size-5" aria-hidden />
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
                    onGetPack();
                  }}
                >
                  <Download className="size-5 shrink-0" aria-hidden />
                  Get pack
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
                  onSelect={(e) => {
                    e.preventDefault();
                    onShare();
                  }}
                >
                  <Share2 className="size-5 shrink-0" aria-hidden />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex items-center justify-between px-4 h-[80px]">
          <button
            type="button"
            onClick={onTogglePlayPause}
            className="relative size-14 shrink-0 overflow-hidden rounded-xs bg-[#dde1e6]"
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
          >
            {pack.coverUrl ? (
              <img src={pack.coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
            )}
            <div className="absolute inset-0 bg-[#161410]/50" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="size-7 text-white fill-white shrink-0" aria-hidden />
              ) : (
                <Play className="size-7 text-white fill-white shrink-0 pl-0.5" aria-hidden />
              )}
            </div>
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-1 px-3">
            <p className="truncate text-sm font-bold leading-5 tracking-[0.1px] text-[#161410]">
              {pack.name}
            </p>
            <p className="truncate text-xs leading-4 tracking-[0.2px] text-[#5e584b]">{pack.creatorName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2]"
              aria-label="Favorite"
            >
              <Heart className="size-5" aria-hidden />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild aria-label="More options">
                <button
                  type="button"
                  className="size-6 flex items-center justify-center rounded-xs text-[#161410] hover:bg-[#e8e2d2] transition-colors"
                >
                  <MoreHorizontal className="size-5" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-[180px] rounded-xs border border-[#d6ceb8] bg-white py-1 shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14),0px_1px_3px_rgba(0,0,0,0.08)]"
              >
                <DropdownMenuItem
                  className="flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-medium tracking-[0.1px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                  onSelect={(e) => {
                    e.preventDefault();
                    onGetPack();
                  }}
                >
                  <Download className="size-5 shrink-0" aria-hidden />
                  Get pack
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
                  onSelect={(e) => {
                    e.preventDefault();
                    onShare();
                  }}
                >
                  <Share2 className="size-5 shrink-0" aria-hidden />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
