import { LDCFooterLink } from "@/components/atoms/ldc-footer-link";
import type { NavigationItem } from "@/config/navigation";

const LAYOUT_CLASSES = {
  "two-columns": "grid grid-cols-2 gap-x-4 gap-y-1",
  "one-column": "grid grid-cols-1 gap-1",
} as const;

interface LDCFooterNavListProps {
  /**
   * Links to render (label + href)
   */
  items: NavigationItem[];

  /**
   * Accessible name of the `<nav>` landmark
   */
  ariaLabel: string;

  /**
   * Grid layout of the list
   * - `two-columns`: main navigation (2 columns)
   * - `one-column`: utility links (single column)
   * @default "two-columns"
   */
  layout?: keyof typeof LAYOUT_CLASSES;
}

/**
 * LDCFooterNavList - Footer Navigation List Component
 *
 * Renders a list of footer links inside a labelled `<nav>` landmark.
 * Used for both the main navigation and the utility links of the footer.
 *
 * This is a Server Component.
 *
 * @example
 * <LDCFooterNavList items={navigationItems} ariaLabel="Footer navigation" />
 * <LDCFooterNavList
 *   items={utilityNavigationItems}
 *   ariaLabel="Utility navigation"
 *   layout="one-column"
 * />
 */
export function LDCFooterNavList({
  items,
  ariaLabel,
  layout = "two-columns",
}: LDCFooterNavListProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ul className={LAYOUT_CLASSES[layout]}>
        {items.map((item) => (
          <li key={item.href}>
            <LDCFooterLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
