"use client";

import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/get-icon";

interface LDCCategoryIconProps {
  /** React Icon name (e.g., "MdRestaurant", "FaUser") */
  iconName: string;
  /** Gradient colors from brand palette */
  gradient: {
    from: string;
    to: string;
  };
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCategoryIcon - Category Icon with Background
 *
 * Displays a react-icon dynamically loaded with background styling.
 * Used in category cards to provide visual identification.
 *
 * @example
 * ```tsx
 * <LDCCategoryIcon
 *   iconName="MdRestaurant"
 *   gradient={{ from: "orange", to: "yellow" }}
 * />
 * ```
 */
export function LDCCategoryIcon({
  iconName,
  gradient,
  className,
}: LDCCategoryIconProps) {
  return (
    <div
      className={cn(
        "relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
        "bg-purple group-hover:bg-pink",
        "transition-all duration-300",
        className
      )}
    >
      {renderIcon(iconName)}
    </div>
  );
}

// Helper function to render icon - keeps component creation out of render
function renderIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-7 h-7 text-white relative z-10" /> : null;
}
