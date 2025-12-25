"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";

interface LDCLoadMoreButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state (e.g., no more items) */
  disabled?: boolean;
  /** Button text */
  label?: string;
  /** Loading text */
  loadingLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCLoadMoreButton - Load More Button Component
 *
 * Button to load more items in a paginated list.
 * Features loading state with spinner animation.
 *
 * @example
 * ```tsx
 * <LDCLoadMoreButton
 *   onClick={handleLoadMore}
 *   isLoading={isLoading}
 *   disabled={!hasMore}
 *   label="Cargar más comercios"
 * />
 * ```
 */
export function LDCLoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = "Cargar más",
  loadingLabel = "Cargando...",
  className,
}: LDCLoadMoreButtonProps) {
  return (
    <div className={cn("flex justify-center pt-8", className)}>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="lg"
        className={cn(
          "min-w-[200px] font-mulish font-semibold",
          "border-2 border-pink dark:border-yellow",
          "text-pink dark:text-yellow",
          "hover:bg-pink hover:text-white dark:hover:bg-yellow dark:hover:text-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            {label}
            <ChevronDown className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
