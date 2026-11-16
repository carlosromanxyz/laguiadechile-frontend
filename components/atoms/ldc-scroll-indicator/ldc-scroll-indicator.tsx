"use client";

import { FaCircleChevronUp } from "react-icons/fa6";
import { useLDCMotionPause } from "@/components/shared/ldc-motion-pause-provider";
import { cn } from "@/lib/utils";

/**
 * LDCScrollIndicator - Scroll Down Indicator Component
 *
 * Displays an animated indicator to encourage users to scroll down.
 * Shows a pulsing icon with text positioned at the bottom of the hero section.
 *
 * Features:
 * - Pulso en bucle con `@keyframes` CSS (`animate-ldc-scroll-pulse`): quieto con
 *   `prefers-reduced-motion` (`motion-reduce:animate-none`) y con la pausa del
 *   `LDCMotionPauseProvider` más cercano (WCAG 2.2.2)
 * - Chevron up icon (to indicate scroll down direction)
 * - Fondo negro al 60 %, plano y sin blur (CLGDC-232): el texto blanco llega a
 *   ≥ 5,7:1 aun sobre la foto más clara
 * - Centered at bottom of hero
 * - Responsive positioning
 *
 * @example
 * <LDCScrollIndicator />
 */

interface LDCScrollIndicatorProps {
  className?: string;
}

export function LDCScrollIndicator({ className }: LDCScrollIndicatorProps) {
  const { paused } = useLDCMotionPause();

  return (
    <div
      className={cn(
        "absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full border border-overlay-foreground/40 bg-overlay/60 px-4 py-2 md:bottom-24 md:px-6",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <FaCircleChevronUp className="h-4 w-4 text-overlay-foreground md:h-5 md:w-5" />
          <div
            aria-hidden
            className={cn(
              "absolute left-0 top-0 h-4 w-4 rounded-full border-2 border-overlay-foreground opacity-80 md:h-5 md:w-5",
              "animate-ldc-scroll-pulse motion-reduce:animate-none",
              paused && "animate-none"
            )}
          />
        </div>
        <span className="whitespace-nowrap text-xs text-overlay-foreground md:text-sm">
          Desliza para ver más
        </span>
      </div>
    </div>
  );
}
