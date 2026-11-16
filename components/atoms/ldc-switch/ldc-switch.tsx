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
 * - Unchecked (off): `--pink` background with `--overlay-foreground` thumb (4:1, graphic ≥ 3:1)
 * - Checked (on): `--yellow` background with `--yellow-foreground` thumb
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
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all cursor-pointer",
        // Focus styles
        "focus-ring",
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
          // Thumb colors - overlay-foreground over pink, yellow-foreground over yellow
          "data-[state=unchecked]:bg-overlay-foreground data-[state=checked]:bg-yellow-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { LDCSwitch }
