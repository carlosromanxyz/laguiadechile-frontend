import { cn } from "@/lib/utils";

interface LDCFooterWidgetProps {
  /**
   * Optional title for the widget section
   */
  title?: string;

  /**
   * Content to display in the widget
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LDCFooterWidget - Footer Widget Container Component
 *
 * A container component for footer sections with an optional title.
 * Used to organize footer content into logical groups.
 *
 * @example
 * <LDCFooterWidget title="Nosotros">
 *   <nav>...</nav>
 * </LDCFooterWidget>
 */
export function LDCFooterWidget({
  title,
  children,
  className,
}: LDCFooterWidgetProps) {
  return (
    <div className={cn("mb-8 last:mb-0 lg:mb-0", className)}>
      {title && (
        <h3 className="mb-4 text-xl font-bold text-foreground">{title}</h3>
      )}
      {children}
    </div>
  );
}
