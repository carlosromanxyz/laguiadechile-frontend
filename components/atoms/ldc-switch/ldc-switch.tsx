"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * LDCSwitch Component
 *
 * Custom styled switch component with La Guía de Chile branding.
 * Extends the base Radix UI Switch with custom OKLCH color styling.
 *
 * @remarks
 * Color Scheme:
 * - Unchecked (off): Pink background (#ff006e)
 * - Checked (on): Yellow background (#ffbe0b) with black thumb
 * - Smooth transitions between states
 *
 * This is a Client Component because Radix UI Switch requires client-side interaction.
 *
 * @example
 * ```tsx
 * <LDCSwitch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * ```
 */
export type LDCSwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>

function LDCSwitch({ className, ...props }: LDCSwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="ldc-switch"
      className={cn(
        // Base styles
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none cursor-pointer",
        // Focus styles
        "focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px]",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Brand colors - unchecked (pink) and checked (yellow)
        "data-[state=unchecked]:bg-pink data-[state=checked]:bg-yellow",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="ldc-switch-thumb"
        className={cn(
          // Base styles
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // Position based on state
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          // Thumb colors - white when unchecked, black when checked (yellow background)
          "data-[state=unchecked]:bg-white data-[state=checked]:bg-black"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { LDCSwitch }
