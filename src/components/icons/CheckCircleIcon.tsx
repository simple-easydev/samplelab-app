import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <circle cx="12" cy="12" r="10" fill="#161410"/>
      <path 
        d="M7 12L10.5 15.5L17 9" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
