/**
 * Mobile-only discover hero carousel — uses shadcn UI Carousel (Embla).
 * Slider: Figma 1382-149520. Each item: Figma 1392-153411.
 * Visible on small viewports only (md:hidden).
 */
import { useState, useEffect } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

export interface MobileCarouselSlide {
  title: string;
  creator: string;
  packs: string;
  genre: string;
  released: string;
  /** Optional cover image URL — Figma 1392-153411 */
  imageUrl?: string;
}

export const MOBILE_CAROUSEL_SLIDES: MobileCarouselSlide[] = [
  { title: 'Sample Pack Name', creator: 'Creator Name', packs: '50 Packs', genre: 'Hip-Hop', released: 'Released 2w ago' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', packs: '24 Packs', genre: 'Lo-Fi', released: 'Released 1w ago' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', packs: '32 Packs', genre: 'Trap', released: 'Released 3d ago' },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', packs: '18 Packs', genre: 'Soul', released: 'Released 5d ago' },
  { title: 'Electronic Textures', creator: 'Synth Wave', packs: '40 Packs', genre: 'Electronic', released: 'Released 1w ago' },
];

/** Single carousel item layout — Figma 1392-153411 */
function DiscoverCarouselMobileItem({ slide }: { slide: MobileCarouselSlide }) {
  return (
    <div className="relative z-10 flex h-full w-full items-stretch gap-3 p-4">
      {/* Cover — left-aligned, fixed size */}
      <div className="size-[72px] shrink-0 overflow-hidden rounded-xs bg-[#161410]/40 border border-[#fffbf0]/10">
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#fffbf0]/30" aria-hidden>
            <Play className="size-6" />
          </div>
        )}
      </div>
      {/* Title + meta */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <h2 className="text-[#fffbf0] text-[18px] font-bold leading-[24px] tracking-[-0.4px] line-clamp-2">
          {slide.title}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#d6ceb8] tracking-[0.2px]">
          <span>{slide.creator}</span>
          <span className="size-1 shrink-0 rounded-full bg-[#d6ceb8]" aria-hidden />
          <span>{slide.packs}</span>
          <span className="size-1 shrink-0 rounded-full bg-[#d6ceb8]" aria-hidden />
          <span>{slide.genre}</span>
          <span className="size-1 shrink-0 rounded-full bg-[#d6ceb8]" aria-hidden />
          <span>{slide.released}</span>
        </div>
      </div>
    </div>
  );
}

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

const buttonOverlayClass =
  'border-[#fffbf0]/30 text-[#fffbf0] hover:bg-[#fffbf0]/10 disabled:opacity-50';

export function DiscoverCarouselMobile() {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    queueMicrotask(onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: true }}
      className="w-full md:hidden"
    >

        {/* Sliding content — one slide per item */}
        <CarouselContent className="absolute inset-0 ml-0 h-full">
          {MOBILE_CAROUSEL_SLIDES.map((s, index) => (
            <CarouselItem
              key={index}
              className="pl-0 basis-full h-full"
            >
              <DiscoverCarouselMobileItem slide={s} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
    </Carousel>
  );
}
