"use client";

import { cn } from "@/lib/utils";
import {
  UtensilsCrossed,
  Hotel,
  Briefcase,
  ShoppingBag,
  Music,
  HeartPulse,
  GraduationCap,
  Car,
} from "lucide-react";

interface LDCCategoryIconProps {
  /** Lucide icon name */
  iconName: string;
  /** Gradient colors from brand palette */
  gradient: {
    from: string;
    to: string;
  };
  /** Optional className for custom styling */
  className?: string;
}

// Map of icon names to icon components (declared outside render)
const ICON_MAP = {
  UtensilsCrossed,
  Hotel,
  Briefcase,
  ShoppingBag,
  Music,
  HeartPulse,
  GraduationCap,
  Car,
} as const;

/**
 * LDCCategoryIcon - Category Icon with Gradient Background
 *
 * Displays a Lucide icon with an animated gradient background.
 * Used in category cards to provide visual identification.
 *
 * @example
 * ```tsx
 * <LDCCategoryIcon
 *   iconName="UtensilsCrossed"
 *   gradient={{ from: "orange", to: "yellow" }}
 * />
 * ```
 */
export function LDCCategoryIcon({
  iconName,
  gradient,
  className,
}: LDCCategoryIconProps) {
  const Icon = ICON_MAP[iconName as keyof typeof ICON_MAP];

  if (!Icon) return null;

  return (
    <div
      className={cn(
        "relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
        "bg-purple group-hover:bg-pink",
        "transition-all duration-300",
        className
      )}
    >
      <Icon className="w-7 h-7 text-white relative z-10" />
    </div>
  );
}
