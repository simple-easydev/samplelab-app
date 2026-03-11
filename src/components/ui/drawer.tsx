"use client";

import * as React from "react";
import { Drawer as VaulDrawer } from "vaul";

import { cn } from "@/lib/utils";

function Drawer({
  open,
  onOpenChange,
  direction = "left",
  ...props
}: React.ComponentProps<typeof VaulDrawer.Root>) {
  return (
    <VaulDrawer.Root
      direction={direction}
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    />
  );
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof VaulDrawer.Trigger>) {
  return <VaulDrawer.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof VaulDrawer.Portal>) {
  return <VaulDrawer.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Overlay>) {
  return (
    <VaulDrawer.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <VaulDrawer.Content
        data-slot="drawer-content"
        className={cn(
          "fixed z-50 flex h-full flex-col bg-[#f6f2e6] shadow-lg",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:max-w-[280px] data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:border-[#e8e2d2]",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:max-w-[280px] data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:border-[#e8e2d2]",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:h-auto data-[vaul-drawer-direction=top]:max-h-[96vh] data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:border-[#e8e2d2]",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:h-auto data-[vaul-drawer-direction=bottom]:max-h-[96vh] data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:border-[#e8e2d2]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[vaul-drawer-direction=left]:data-[state=closed]:slide-out-to-left data-[vaul-drawer-direction=left]:data-[state=open]:slide-in-from-left",
          "data-[vaul-drawer-direction=right]:data-[state=closed]:slide-out-to-right data-[vaul-drawer-direction=right]:data-[state=open]:slide-in-from-right",
          "data-[vaul-drawer-direction=top]:data-[state=closed]:slide-out-to-top data-[vaul-drawer-direction=top]:data-[state=open]:slide-in-from-top",
          "data-[vaul-drawer-direction=bottom]:data-[state=closed]:slide-out-to-bottom data-[vaul-drawer-direction=bottom]:data-[state=open]:slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
      </VaulDrawer.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Title>) {
  return (
    <VaulDrawer.Title
      data-slot="drawer-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Description>) {
  return (
    <VaulDrawer.Description
      data-slot="drawer-description"
      className={cn("text-sm text-[#5e584b]", className)}
      {...props}
    />
  );
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof VaulDrawer.Close>) {
  return <VaulDrawer.Close data-slot="drawer-close" {...props} />;
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
