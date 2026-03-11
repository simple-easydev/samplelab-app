import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DISCOVER_CAROUSEL_SLIDES } from '@/pages/dashboard/constants';

function PaginationDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        'size-2 rounded-full shrink-0 transition-colors',
        selected ? 'bg-[#fffbf0]' : 'bg-[#fffbf0]/40'
      )}
      aria-hidden
    />
  );
}

export function DiscoverCarousel() {
  const [current, setCurrent] = useState(0);
  const total = DISCOVER_CAROUSEL_SLIDES.length;

  const goTo = useCallback((index: number) => {
    setCurrent(() => {
      if (index < 0) return total - 1;
      if (index >= total) return 0;
      return index;
    });
  }, [total]);

  const slide = DISCOVER_CAROUSEL_SLIDES[current];

  return (
    <div className="bg-[#f2f4f8] h-80 overflow-hidden rounded p-6 relative w-full">
      {/* Background with gradient overlay - Figma slider style */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(90deg, rgb(0,0,0) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#161410]/60" aria-hidden />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4 max-w-[652px]">
          <h2 className="text-[#fffbf0] text-[48px] font-bold leading-[56px] tracking-[-0.6px]">
            {slide.title}
          </h2>
          <div className="flex gap-2 items-center flex-wrap text-[12px] text-[#d6ceb8] tracking-[0.2px]">
            <span>{slide.creator}</span>
            <span className="size-1 rounded-full bg-[#d6ceb8] shrink-0" aria-hidden />
            <span>{slide.packs}</span>
            <span className="size-1 rounded-full bg-[#d6ceb8] shrink-0" aria-hidden />
            <span>{slide.genre}</span>
            <span className="size-1 rounded-full bg-[#d6ceb8] shrink-0" aria-hidden />
            <span>{slide.released}</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex gap-6 items-center">
            <button
              type="button"
              className="size-10 flex items-center justify-center rounded-[2px] bg-[#fffbf0]/10 text-[#fffbf0] hover:bg-[#fffbf0]/20 transition-colors"
              aria-label="Play"
            >
              <Play className="size-5 fill-current" />
            </button>
            <button
              type="button"
              className="border border-[#fffbf0]/30 h-10 flex items-center justify-center gap-1.5 px-3 rounded-[2px] text-[#fffbf0] text-sm font-medium tracking-[0.1px] hover:bg-[#fffbf0]/10 transition-colors"
            >
              View pack
              <ArrowRight className="size-5" />
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="border border-[#fffbf0]/30 size-10 flex items-center justify-center rounded-[2px] text-[#fffbf0] hover:bg-[#fffbf0]/10 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="border border-[#fffbf0]/30 size-10 flex items-center justify-center rounded-[2px] text-[#fffbf0] hover:bg-[#fffbf0]/10 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Pagination dots - bottom center */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 items-center z-20"
        role="tablist"
        aria-label="Carousel pagination"
      >
        {DISCOVER_CAROUSEL_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffbf0] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <PaginationDot selected={index === current} />
          </button>
        ))}
      </div>
    </div>
  );
}
