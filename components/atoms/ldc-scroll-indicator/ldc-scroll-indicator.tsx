"use client";

import { motion } from "framer-motion";
import { FaCircleChevronUp } from "react-icons/fa6";
import { cn } from "@/lib/utils";

/**
 * LDCScrollIndicator - Scroll Down Indicator Component
 *
 * Displays an animated indicator to encourage users to scroll down.
 * Shows a pulsing icon with text positioned at the bottom of the hero section.
 *
 * Features:
 * - Animated pulsing circle using Framer Motion
 * - Chevron up icon (to indicate scroll down direction)
 * - Semi-transparent white background
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
  return (
    <div
      className={cn(
        "absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/40 bg-white/10 px-6 py-2 backdrop-blur-sm md:bottom-24",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <FaCircleChevronUp className="h-5 w-5 text-white" />
          <motion.div
            className="absolute left-0 top-0 h-5 w-5 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
        <span className="text-sm text-white">Desliza para ver más</span>
      </div>
    </div>
  );
}
