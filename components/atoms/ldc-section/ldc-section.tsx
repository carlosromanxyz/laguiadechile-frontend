import { LDCContainer } from "@/components/atoms/ldc-container";
import { cn } from "@/lib/utils";
import {
  SECTION_PADDING_Y,
  type ContainerSize,
  type SectionPaddingY,
} from "@/lib/ui/layout";
import { ReactNode } from "react";

interface LDCSectionProps {
  /** Section content */
  children: ReactNode;
  /** Optional className for custom styling */
  className?: string;
  /** Container max-width variant */
  containerSize?: ContainerSize;
  /** Vertical padding variant */
  paddingY?: SectionPaddingY;
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
  return (
    <section className={cn(SECTION_PADDING_Y[paddingY], className)}>
      <LDCContainer size={containerSize}>{children}</LDCContainer>
    </section>
  );
}
