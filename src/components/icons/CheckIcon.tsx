import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  stroke?: string;
}

export function CheckIcon({ className, stroke = "currentColor" }: IconProps) {
  return (
    <svg className={cn("w-5 h-5 shrink-0", className)} viewBox="0 0 20 20" fill="none">
      <path 
        d="M5.83 10L8.99 13.17L14.17 8" 
        stroke={stroke}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
