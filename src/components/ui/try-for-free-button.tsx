"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export interface TryForFreeButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children?: React.ReactNode;
}

/**
 * Custom CTA button from Figma: black background, white text, rounded corners.
 * Default label: "Try for free". Pass children to override.
 */
const TryForFreeButton = React.forwardRef<
  HTMLButtonElement,
  TryForFreeButtonProps
>(({ className, asChild = false, children = "Try for free", ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      ref={ref}
      data-slot="try-for-free-button"
      className={cn(
        "inline-flex items-center justify-center rounded-xs px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
        "bg-black",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

TryForFreeButton.displayName = "TryForFreeButton";

export { TryForFreeButton };
