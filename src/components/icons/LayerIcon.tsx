import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function LayerIcon({ className }: IconProps) {
  return (
    <img
      src="/layer-icon.png"
      alt="Layer"
      width={40}
      height={40}
      className={cn("shrink-0", className)}
    />
  );
}
