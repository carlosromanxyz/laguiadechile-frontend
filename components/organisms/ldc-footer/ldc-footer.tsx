import Link from "next/link";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCFooterWidget } from "@/components/molecules/ldc-footer-widget";
import { LDCFooterNavList } from "@/components/molecules/ldc-footer-nav-list";
import { LDCFooterUtilityList } from "@/components/molecules/ldc-footer-utility-list";
import { LDCSocialNetworkList } from "@/components/molecules/ldc-social-network-list";
import { LDCAppStoreBadges } from "@/components/molecules/ldc-app-store-badges";

/**
 * LDCFooter - Main Footer Component
 *
 * The main footer component for La Guía de Chile.
 * Displays logo, navigation links, utility links, and social media icons.
 * Also includes copyright and developer credits section.
 *
 * Features:
 * - Responsive grid layout (1 col mobile, 2 cols tablet, 4 cols desktop)
 * - Logo with social media icons
 * - Main navigation links
 * - Utility links (register, login, privacy, terms)
 * - Copyright notice with dynamic year
 * - Developer credits
 *
 * @example
 * <LDCFooter />
 */
export function LDCFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Main Footer Section */}
      <footer className="bg-muted/30 py-10">
        <div className="container mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          {/* Logo & Social Networks Widget */}
          <LDCFooterWidget className="flex flex-col items-center lg:items-start">
            <LDCLogo isotipoSize="md" />
            <div className="mt-8 flex justify-center lg:justify-start">
              <LDCSocialNetworkList />
            </div>
          </LDCFooterWidget>

          {/* Navigation Widget */}
          <LDCFooterWidget title="Nosotros">
            <LDCFooterNavList />
          </LDCFooterWidget>

          {/* Utility Links Widget */}
          <LDCFooterWidget title="Enlaces útiles">
            <LDCFooterUtilityList />
          </LDCFooterWidget>

          {/* App Download Widget */}
          <LDCFooterWidget title="Descarga la aplicación">
            <p className="mb-6 text-sm text-foreground/60">
              Descarga la aplicación para iOS o Android y llévanos en tu móvil.
            </p>
            <LDCAppStoreBadges />
          </LDCFooterWidget>
        </div>
      </footer>

      {/* Copyright & Credits Section */}
      <section className="bg-muted/50 py-4">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-2 px-6 lg:grid-cols-2">
          <p className="text-center text-sm text-foreground/60 lg:text-start">
            © {currentYear} La Guía de Chile - Derechos reservados.
          </p>
          <Link
            href="https://carlosroman.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm text-foreground/60 transition-colors hover:text-orange lg:text-end"
          >
            Desarrollado por Carlos Román
          </Link>
        </div>
      </section>
    </>
  );
}
