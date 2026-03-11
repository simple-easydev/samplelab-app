/**
 * Mobile-only discover hero carousel — uses shadcn UI Carousel (Embla).
 * Slider: Figma 1382-149520. Each item: Figma 1392-153411.
 * Visible on small viewports only (md:hidden).
 */
import { useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  DISCOVER_CAROUSEL_SLIDES,
  type DiscoverCarouselSlide,
} from '@/pages/dashboard/constants';

const CAROUSEL_HEIGHT = 320;

/** Carousel item — Figma 1392-153411: full-bleed card with background image, title/meta top-left, play + Browse pack bottom-left. */
function DiscoverCarouselMobileItem({ slide }: { slide: DiscoverCarouselSlide }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#161410]">
      {/* Background image or placeholder */}
      <div className="absolute inset-0 z-0">
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-[#161410]"
            aria-hidden
          />
        )}
        {/* Dark gradient overlay for text contrast */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
          aria-hidden
        />
      </div>

      {/* Content overlay — Figma layout */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Top-left: title + meta */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[#fffbf0] text-xl font-bold leading-[26px] tracking-[-0.4px] line-clamp-2">
            {slide.title}
          </h2>
          <div className="flex flex-wrap items-center gap-[6px] text-xs leading-[14px] text-[#fffbf0]/90 tracking-[0.2px]">
            <span>{slide.creator}</span>
            <span className="size-1 shrink-0 rounded-full bg-[#fffbf0]/80" aria-hidden />
            <span>{slide.packs}</span>
            <span className="size-1 shrink-0 rounded-full bg-[#fffbf0]/80" aria-hidden />
            <span>{slide.genre}</span>
          </div>
        </div>

        {/* Bottom-left: play button + Browse pack */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="size-14 shrink-0 flex items-center justify-center rounded-full bg-white text-[#161410] shadow-lg hover:bg-white/95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="Play"
          >
            <Play className="size-7 fill-current pl-0.5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[#fffbf0] text-sm font-medium tracking-[0.1px] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffbf0] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
          >
            Browse pack
            <ArrowRight className="size-5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiscoverCarouselMobile() {
  const [, setApi] = useState<CarouselApi>(undefined);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'center', loop: true }}
      className="w-screen relative left-1/2 -translate-x-1/2 md:hidden"
      style={{ height: `${CAROUSEL_HEIGHT}px` }}
    >
        {/* Sliding content — side padding = half of gap so loop seam matches gap between items */}
        <CarouselContent className="h-full ml-0 gap-2 pl-2 pr-2">
          {DISCOVER_CAROUSEL_SLIDES.map((s, index) => (
            <CarouselItem
              key={index}
              className="h-full basis-2/3 shrink-0 pl-0"
              style={{ minHeight: `${CAROUSEL_HEIGHT}px` }}
            >
              <DiscoverCarouselMobileItem slide={s} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
    </Carousel>
  );
}
