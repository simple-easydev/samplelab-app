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

export function CheckLightIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" fill="none" className={cn("w-5 h-5 shrink-0", className)}>
      <path d="M18.196 0.945969L6.19597 12.946C6.0905 13.0513 5.94753 13.1105 5.79847 13.1105C5.64941 13.1105 5.50644 13.0513 5.40097 12.946L0.150969 7.69597C0.0516087 7.58934 -0.00248353 7.4483 8.76355e-05 7.30258C0.0026588 7.15685 0.0616926 7.01781 0.164752 6.91475C0.267812 6.81169 0.406851 6.75266 0.552577 6.75009C0.698303 6.74752 0.839338 6.80161 0.945969 6.90097L5.79847 11.7525L17.401 0.150969C17.5076 0.0516094 17.6486 -0.00248353 17.7944 8.76344e-05C17.9401 0.0026588 18.0791 0.0616933 18.1822 0.164753C18.2852 0.267813 18.3443 0.406852 18.3469 0.552578C18.3494 0.698303 18.2953 0.839338 18.196 0.945969Z" fill="#161410"/>
    </svg>
  );
}
