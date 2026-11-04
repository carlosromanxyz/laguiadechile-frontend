import { cn } from "@/lib/utils";

interface LDCNumberBadgeProps {
  /** Number to display */
  number: number;
  /** Optional className for custom styling */
  className?: string;
  /** Badge style variant */
  variant?: "solid" | "outline";
}

/**
 * LDCNumberBadge - Numbered Badge Component
 *
 * A circular badge displaying a number with brand styling.
 * Supports solid (flat brand color) and outline variants.
 * `solid` uses `bg-pink-strong` with white text (5.23:1 in both themes), like the CTA.
 * Used in lists and feature sections.
 *
 * @example
 * ```tsx
 * <LDCNumberBadge number={1} variant="solid" />
 * <LDCNumberBadge number={2} variant="outline" />
 * ```
 */
export function LDCNumberBadge({
  number,
  className,
  variant = "outline",
}: LDCNumberBadgeProps) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl font-bold transition-transform",
        variant === "solid" && "bg-pink-strong text-white shadow-sm",
        variant === "outline" &&
          "border-2 border-border text-2xl text-pink shadow-lg dark:text-yellow",
        className
      )}
    >
      {number}
    </span>
  );
}
