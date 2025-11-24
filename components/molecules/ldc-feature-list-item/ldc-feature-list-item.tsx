import { LDCNumberBadge } from "@/components/atoms/ldc-number-badge";
import { cn } from "@/lib/utils";

interface LDCFeatureListItemProps {
  /** Item number */
  number: number;
  /** Feature text */
  text: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCFeatureListItem - Feature List Item Component
 *
 * A list item component with numbered badge and text.
 * Used to display features or benefits.
 *
 * @example
 * ```tsx
 * <LDCFeatureListItem
 *   number={1}
 *   text="Promociona tu comercio y/o servicio."
 * />
 * ```
 */
export function LDCFeatureListItem({
  number,
  text,
  className,
}: LDCFeatureListItemProps) {
  return (
    <li className={cn("mb-8 flex items-center text-lg", className)}>
      <LDCNumberBadge number={number} className="me-4 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}
