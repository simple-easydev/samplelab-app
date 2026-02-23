"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-6" strokeWidth={2} />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!bg-[#d6efe5] !border-[#84cfaf] !shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]",
          title: "!text-base !font-bold !text-[#161410]",
          description: "!text-sm !text-[#5e584b]",
          success: "!text-[#10b981]",
          closeButton: "!text-[#161410] hover:!text-[#5e584b]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
