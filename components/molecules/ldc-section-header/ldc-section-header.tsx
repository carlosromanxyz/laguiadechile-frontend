import { cn } from "@/lib/utils";

interface LDCSectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional alignment: left, center, or right */
  align?: "left" | "center" | "right";
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCSectionHeader - Reusable Section Header Component
 *
 * Displays a title and optional subtitle for content sections.
 * Provides consistent typography and spacing across the application.
 *
 * @example
 * ```tsx
 * <LDCSectionHeader
 *   title="Categorías destacadas"
 *   subtitle="Explora nuestras categorías más populares"
 *   align="center"
 * />
 * ```
 */
export function LDCSectionHeader({
  title,
  subtitle,
  align = "left",
  className,
}: LDCSectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

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
