import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LDCBadgeProps {
  /** Badge content */
  children: ReactNode;
  /** Variant color scheme */
  variant?: "featured" | "new" | "updated" | "default";
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCBadge - Reusable Badge Component
 *
 * Small label component for displaying status or category information.
 * Used in listing cards for featured, new, and updated indicators.
 *
 * @example
 * ```tsx
 * <LDCBadge variant="featured">Destacado</LDCBadge>
 * <LDCBadge variant="new">Nuevo</LDCBadge>
 * ```
 */
export function LDCBadge({
  children,
  variant = "default",
  className,
}: LDCBadgeProps) {
  const variants = {
    featured: "bg-yellow text-black",
    new: "bg-pink text-white",
    updated: "bg-purple text-white",
    default: "bg-pink dark:bg-purple text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-mulish",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
