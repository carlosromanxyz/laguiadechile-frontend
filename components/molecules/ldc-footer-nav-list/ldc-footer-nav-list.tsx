import { LDCFooterLink } from "@/components/atoms/ldc-footer-link";
import { navigationItems } from "@/config/navigation";

/**
 * LDCFooterNavList - Footer Navigation List Component
 *
 * Displays the main navigation links in the footer.
 * Automatically renders all navigation items from the site configuration
 * in a two-column grid layout (4 items per column).
 *
 * This is a Server Component that fetches navigation data from the config.
 *
 * @example
 * <LDCFooterNavList />
 */
export function LDCFooterNavList() {
  return (
    <nav aria-label="Footer navigation">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <LDCFooterLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
