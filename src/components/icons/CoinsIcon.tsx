import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function CoinsIcon({ className }: IconProps) {
  return (
    <img
      src="/coins-icon.png"
      alt="Coins"
      width={40}
      height={40}
      className={cn("shrink-0", className)}
    />
  );
}
