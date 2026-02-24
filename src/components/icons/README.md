# Icons Organization

This folder contains all SVG icons used throughout the application, organized as reusable React components.

## Structure

```
src/components/icons/
├── index.ts                 # Central export file
├── GoogleIcon.tsx           # Google OAuth logo
├── AppleIcon.tsx            # Apple OAuth logo
├── FacebookIcon.tsx         # Facebook OAuth logo
├── ArrowLeftIcon.tsx        # Back/left navigation arrow
├── ArrowRightIcon.tsx       # Forward/right navigation arrow
├── CheckIcon.tsx            # Checkmark icon for lists
└── CheckCircleIcon.tsx      # Checkmark in circle (selected state)
```

## Usage

Import icons from the central index file:

```tsx
import { GoogleIcon, CheckIcon, ArrowLeftIcon } from '@/components/icons';

// Use in components
<GoogleIcon className="w-5 h-5" />
<CheckIcon stroke="#161410" />
<ArrowLeftIcon className="mr-2" />
```

## Icon Components

### Social Media Icons
- **GoogleIcon** - Google OAuth button icon
- **AppleIcon** - Apple OAuth button icon
- **FacebookIcon** - Facebook OAuth button icon

### Navigation Icons
- **ArrowLeftIcon** - Back button arrow
- **ArrowRightIcon** - Forward button arrow

### UI Icons
- **CheckIcon** - Checkmark for benefit lists and feature indicators
  - Accepts optional `stroke` prop to customize color
- **CheckCircleIcon** - Selected state indicator (checkmark in circle)

## Props

All icon components accept:
- `className` - Tailwind CSS classes for styling
- Some icons accept additional props (e.g., `CheckIcon` accepts `stroke`)

## Adding New Icons

1. Create a new file in `src/components/icons/[IconName].tsx`
2. Follow the existing pattern:
   ```tsx
   import { cn } from '@/lib/utils';
   
   interface IconProps {
     className?: string;
   }
   
   export function IconName({ className }: IconProps) {
     return (
       <svg className={cn("default-classes", className)} viewBox="0 0 24 24">
         {/* SVG paths */}
       </svg>
     );
   }
   ```
3. Export from `index.ts`:
   ```tsx
   export { IconName } from './IconName';
   ```
4. Import and use:
   ```tsx
   import { IconName } from '@/components/icons';
   ```

## SVG Files in /public

Static SVG files remain in `/public` folder:
- `logo.svg` - Application logo
- `logo.png` - Application logo (PNG format)
- `file.svg`, `globe.svg`, `window.svg` - Utility SVGs
- `next.svg`, `vercel.svg` - Framework logos

These are accessed via URL paths like `/logo.svg`.
