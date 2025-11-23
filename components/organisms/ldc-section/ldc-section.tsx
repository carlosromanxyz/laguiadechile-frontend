import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LDCSectionProps {
  /** Section content */
  children: ReactNode;
  /** Optional className for custom styling */
  className?: string;
  /** Container max-width variant */
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  /** Vertical padding variant */
  paddingY?: "sm" | "md" | "lg" | "xl";
}

/**
 * LDCSection - Reusable Section Container Component
 *
 * Provides consistent container, padding, and spacing for content sections.
 * Used as a wrapper for major page sections.
 *
 * @example
 * ```tsx
 * <LDCSection containerSize="lg" paddingY="lg">
 *   <LDCSectionHeader title="Featured Categories" />
 *   <div>Section content...</div>
 * </LDCSection>
 * ```
 */
export function LDCSection({
  children,
  className,
  containerSize = "lg",
  paddingY = "lg",
}: LDCSectionProps) {
  const containerSizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1400px]",
    full: "max-w-full",
  };

  const paddingSizes = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
    xl: "py-24 md:py-32",
  };

  return (
    <section className={cn(paddingSizes[paddingY], className)}>
      <div className={cn("container mx-auto px-4 lg:px-8", containerSizes[containerSize])}>
        {children}
      </div>
    </section>
  );
}
