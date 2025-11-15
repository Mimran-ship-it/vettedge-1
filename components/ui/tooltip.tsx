"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        {...props}
        className={cn(
          // ✅ Sharp, visible in both themes
          "z-50 w-max max-w-xs  px-3 py-1.5 text-xs font-medium",
          "bg-gray-900 text-black dark:bg-gray-900 dark:text-white",
          "light:bg-white light:text-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg",
          // ✅ No scroll, no blur
          "overflow-hidden select-none whitespace-nowrap",
          // ✅ Smooth + crisp animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0 zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className
        )}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
