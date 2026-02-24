import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={cn("w-7 h-7", className)} viewBox="0 0 28 28" fill="none">
      <path 
        d="M10.5 7L17.5 14L10.5 21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
