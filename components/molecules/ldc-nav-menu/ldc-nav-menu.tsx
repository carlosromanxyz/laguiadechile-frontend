import { LDCNavLink } from "@/components/atoms/ldc-nav-link";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface LDCNavMenuProps {
  /**
   * Additional CSS classes for the nav container
   */
  className?: string;
}

/**
 * LDCNavMenu - Navigation Menu Component
 *
 * A navigation menu that renders all navigation items from the config.
 * Composed of individual LDCNavLink atoms with active state management.
 *
 * Features:
 * - Automatically renders all navigation items from config
 * - Responsive gap spacing between items
 * - Semantic nav element with ARIA label
 * - Desktop-focused horizontal layout
 *
 * @example
 * <LDCNavMenu />
 *
 * @example
 * // With custom styling
 * <LDCNavMenu className="gap-2" />
 */
export function LDCNavMenu({ className }: LDCNavMenuProps) {
  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => (
        <LDCNavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
