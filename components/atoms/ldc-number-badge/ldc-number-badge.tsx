import { cn } from "@/lib/utils";

interface LDCNumberBadgeProps {
  /** Number to display */
  number: number;
  /** Optional className for custom styling */
  className?: string;
  /** Badge style variant */
  variant?: "gradient" | "outline";
}

/**
 * LDCNumberBadge - Numbered Badge Component
 *
 * A circular badge displaying a number with brand styling.
 * Supports gradient and outline variants.
 * Used in lists and feature sections.
 *
 * @example
 * ```tsx
 * <LDCNumberBadge number={1} variant="gradient" />
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
        "flex h-12 w-12 items-center justify-center rounded-xl font-bold shadow-lg transition-transform",
        variant === "gradient" &&
          "bg-gradient-to-br from-purple via-pink to-orange text-white shadow-purple/20",
        variant === "outline" &&
          "border-2 border-border text-2xl text-pink dark:text-yellow",
        className
      )}
    >
      {number}
    </span>
  );
}
