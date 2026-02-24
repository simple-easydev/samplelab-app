import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg className={cn("w-7 h-7", className)} viewBox="0 0 28 28" fill="none">
      <path 
        d="M17.5 21L10.5 14L17.5 7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
