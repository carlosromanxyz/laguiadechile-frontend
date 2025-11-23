import { LDCFooterLink } from "@/components/atoms/ldc-footer-link";
import { utilityNavigationItems } from "@/config/navigation";

/**
 * LDCFooterUtilityList - Footer Utility Links Component
 *
 * Displays utility navigation links in the footer including authentication
 * and legal pages (register, login, privacy policy, terms & conditions).
 * Automatically renders all utility navigation items from the site configuration
 * in a single-column grid layout.
 *
 * This is a Server Component that fetches utility navigation data from the config.
 *
 * @example
 * <LDCFooterUtilityList />
 */
export function LDCFooterUtilityList() {
  return (
    <nav aria-label="Utility navigation">
      <ul className="grid grid-cols-1 gap-1">
        {utilityNavigationItems.map((item) => (
          <li key={item.href}>
            <LDCFooterLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
