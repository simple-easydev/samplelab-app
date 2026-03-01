/**
 * Reusable card carousel from Figma (node 812-51974) – section with title, CTA link, prev/next arrows, horizontal scroll.
 * Use for Featured Packs, Featured creators, etc.
 */
import { useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface CardCarouselProps {
  title: string;
  ctaLabel: string;
  onCtaClick?: () => void;
  children: React.ReactNode;
}

const SCROLL_AMOUNT = 240;

export function CardCarousel({ title, ctaLabel, onCtaClick, children }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Section header: title + CTA + arrows */}
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-6 items-center">
          <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px] whitespace-nowrap">
            {title}
          </h2>
          <a
            href="#"
            onClick={(e) => {
              if (onCtaClick) {
                e.preventDefault();
                onCtaClick();
              }
            }}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-[2px] border border-[#a49a84] text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:bg-[#161410]/5 transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="size-5 shrink-0" />
          </a>
        </div>
        <div className="flex gap-3 items-center shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="border border-[#a49a84] size-10 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#161410]/5 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="border border-[#a49a84] size-10 flex items-center justify-center rounded-[2px] text-[#161410] hover:bg-[#161410]/5 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Scrollable cards row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden w-full scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {children}
      </div>
    </div>
  );
}
