import { cn } from "@/lib/utils";

interface LDCNumberBadgeProps {
  /** Number to display */
  number: number;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCNumberBadge - Numbered Badge Component
 *
 * A circular badge displaying a number with brand styling.
 * Used in lists and feature sections.
 *
 * @example
 * ```tsx
 * <LDCNumberBadge number={1} />
 * ```
 */
export function LDCNumberBadge({ number, className }: LDCNumberBadgeProps) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-border text-2xl font-bold text-pink dark:text-yellow",
        className
      )}
    >
      {number}
    </span>
  );
}
