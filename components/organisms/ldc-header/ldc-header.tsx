/**
 * LDCHeader Component (Desktop-focused)
 *
 * Sticky header component that combines logo, navigation menu, theme toggle, and CTA button.
 * Composed of atomic and molecular components following Atomic Design methodology.
 *
 * Features:
 * - Sticky header with fixed positioning
 * - Logo, navigation menu, and publish CTA button
 * - Active link highlighting (delegated to LDCNavLink)
 * - Smooth hover transitions
 * - Professional, clean design for desktop displays
 */

import Link from "next/link";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCThemeModeToggler } from "@/components/molecules/ldc-theme-mode-toggler";
import { LDCNavMenu } from "@/components/molecules/ldc-nav-menu";

export function LDCHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <LDCLogo isotipoSize="sm" />
        </Link>

        {/* Navigation Menu */}
        <LDCNavMenu />

        {/* Right Section - Theme Toggle & Publish Button */}
        <div className="flex items-center gap-4">
          <LDCThemeModeToggler />
          <LDCCTAButton text="Publicar" href="/publicar" />
        </div>
      </div>
    </header>
  );
}
