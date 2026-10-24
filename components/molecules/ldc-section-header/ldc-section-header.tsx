import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LDCSectionHeaderTone = "pink" | "purple" | "orange";

interface LDCSectionHeaderProps {
  /** Section title */
  title: string;
  /**
   * Optional line under the title. In `compact` it is the count line
   * (e.g. "12 publicaciones en Santiago").
   */
  subtitle?: ReactNode;
  /**
   * `section` (default): large centered-or-aligned header for home sections.
   * `compact`: icon tile, title, subtitle and an optional "Ver todos →" link
   * hidden on mobile, as in the city page sections.
   */
  variant?: "section" | "compact";
  /** Alignment: left, center, or right. Only applies to `section`; ignored in `compact`. */
  align?: "left" | "center" | "right";
  /** Optional className for custom styling */
  className?: string;
  /**
   * `compact` only. Icon already rendered, e.g. `<Store className="w-5 h-5 text-pink" />`.
   * Pass JSX, not a Lucide component, so it can cross the server→client
   * boundary. Its color class (`text-X`) is set by the consumer and must
   * match `tone`.
   */
  icon?: ReactNode;
  /** `compact` only. Color of the icon tile background. Defaults to `pink`. */
  tone?: LDCSectionHeaderTone;
  /** `compact` only. Optional "view all" link target */
  viewAllHref?: string;
  /** `compact` only. Label for the "view all" link. Defaults to "Ver todos". */
  viewAllLabel?: string;
}

const toneTileClasses: Record<LDCSectionHeaderTone, string> = {
  pink: "bg-pink/10 dark:bg-pink/20",
  purple: "bg-purple/10 dark:bg-purple/20",
  orange: "bg-orange/10 dark:bg-orange/20",
};

/**
 * LDCSectionHeader - Reusable Section Header Component
 *
 * Displays a title and optional subtitle for content sections.
 * Provides consistent typography and spacing across the application.
 *
 * Variants:
 * - `section` (default): title + subtitle, aligned with `align`.
 * - `compact`: optional icon tile (colored by `tone`), title, subtitle line
 *   and optional "Ver todos →" link (`viewAllHref`). `align` does not apply.
 *
 * @example
 * ```tsx
 * <LDCSectionHeader
 *   title="Categorías destacadas"
 *   subtitle="Explora nuestras categorías más populares"
 *   align="center"
 * />
 *
 * <LDCSectionHeader
 *   variant="compact"
 *   title="Propiedades"
 *   icon={<Home className="w-5 h-5 text-purple" />}
 *   tone="purple"
 *   subtitle="12 propiedades en Santiago"
 *   viewAllHref="/propiedades?ciudad=santiago"
 *   viewAllLabel="Ver todas"
 * />
 * ```
 */
export function LDCSectionHeader({
  title,
  subtitle,
  variant = "section",
  align = "left",
  className,
  icon,
  tone = "pink",
  viewAllHref,
  viewAllLabel = "Ver todos",
}: LDCSectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center justify-between mb-6", className)}>
        <div className="flex items-center gap-3">
          {icon != null && (
            <div
              className={`w-10 h-10 rounded-lg ${toneTileClasses[tone]} flex items-center justify-center`}
            >
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold font-mulish text-foreground">
              {title}
            </h2>
            {subtitle != null && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-pink dark:text-yellow hover:underline hidden sm:block"
          >
            {`${viewAllLabel} →`}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={cn("mb-8", alignmentClasses[align], className)}>
      <h2 className="text-3xl md:text-4xl font-black font-mulish text-blue-gray dark:text-white mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground font-open-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
