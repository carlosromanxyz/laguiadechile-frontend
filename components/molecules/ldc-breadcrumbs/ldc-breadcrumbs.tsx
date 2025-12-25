import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** URL path (empty string for current page) */
  href: string;
}

interface LDCBreadcrumbsProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Optional className for custom styling */
  className?: string;
  /** Color variant for different backgrounds */
  variant?: "light" | "dark";
}

/**
 * LDCBreadcrumbs - Navigation Breadcrumb Component
 *
 * Displays a hierarchical navigation trail for the current page.
 * Supports both light and dark variants for different backgrounds.
 *
 * @example
 * ```tsx
 * <LDCBreadcrumbs
 *   items={[
 *     { label: "Inicio", href: "/" },
 *     { label: "Comercios", href: "" }
 *   ]}
 *   variant="dark"
 * />
 * ```
 */
export function LDCBreadcrumbs({
  items,
  className,
  variant = "light",
}: LDCBreadcrumbsProps) {
  const variants = {
    light: {
      link: "text-muted-foreground hover:text-foreground",
      current: "text-foreground font-medium",
      separator: "text-muted-foreground/50",
      home: "text-muted-foreground hover:text-foreground",
    },
    dark: {
      link: "text-white/70 hover:text-white",
      current: "text-white font-medium",
      separator: "text-white/40",
      home: "text-white/70 hover:text-white",
    },
  };

  const styles = variants[variant];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm font-open-sans", className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const hasHref = item.href !== "";

          return (
            <li key={index} className="flex items-center gap-1.5">
              {/* Separator (not for first item) */}
              {!isFirst && (
                <ChevronRight
                  className={cn("w-4 h-4 flex-shrink-0", styles.separator)}
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb item */}
              {hasHref ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    isFirst ? styles.home : styles.link
                  )}
                >
                  {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={styles.current}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
