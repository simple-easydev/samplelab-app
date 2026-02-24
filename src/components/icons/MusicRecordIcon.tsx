import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function MusicRecordIcon({ className }: IconProps) {
  return (
    <img
      src="/music-icon.png"
      alt="Music Record"
      width={40}
      height={40}
      className={cn("shrink-0", className)}
    />
  );
}
