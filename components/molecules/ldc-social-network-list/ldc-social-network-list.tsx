import { LDCSocialNetworkIcon } from "@/components/atoms/ldc-social-network-icon";
import { socialNetworks } from "@/config/social-networks";

/**
 * LDCSocialNetworkList - Social Media Links Component
 *
 * Displays a horizontal list of social media icon links for La Guía de Chile.
 * Each icon features a circular wrapper with smooth color transitions on hover,
 * using the brand colors specific to each social network platform.
 *
 * Icons included: Facebook, Instagram, X (Twitter), and YouTube.
 *
 * This is a Server Component that fetches social network data from the config.
 *
 * @example
 * <LDCSocialNetworkList />
 */
export function LDCSocialNetworkList() {
  return (
    <nav aria-label="Social media links">
      <ul className="flex flex-row gap-3">
        {socialNetworks.map((network) => (
          <li key={network.name}>
            <LDCSocialNetworkIcon
              name={network.name}
              url={network.url}
              icon={network.icon}
              colorClass={network.colorClass}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
