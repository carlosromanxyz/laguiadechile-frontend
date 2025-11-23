/**
 * LDCHeader Component (Responsive)
 *
 * Sticky header component that combines logo, navigation menu, theme toggle, and CTA button.
 * Composed of atomic and molecular components following Atomic Design methodology.
 *
 * Features:
 * - Sticky header with fixed positioning
 * - Responsive design: full menu on desktop (md+), mobile menu on mobile
 * - Logo, navigation menu, and publish CTA button
 * - Active link highlighting (delegated to LDCNavLink)
 * - Mobile hamburger menu with slide-in sheet
 * - Smooth hover transitions
 * - Professional, clean design for all screen sizes
 */

import Link from "next/link";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCThemeModeToggler } from "@/components/molecules/ldc-theme-mode-toggler";
import { LDCNavMenu } from "@/components/molecules/ldc-nav-menu";
import { LDCMobileMenu } from "@/components/molecules/ldc-mobile-menu";

export function LDCHeader() {
  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4">
      {/* Floating backdrop wrapper with rounded corners, background, opacity and blur */}
      <div className="container mx-auto max-w-7xl rounded-full border border-border/40 bg-white/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/30 dark:bg-black/40 dark:supports-[backdrop-filter]:bg-black/30">
        <div className="flex h-16 items-center justify-between px-4">
        {/* Logo Section - Responsive sizes: xs on mobile, sm on desktop */}
        <Link href="/" className="flex items-center">
          <LDCLogo isotipoSize="xs" className="md:hidden" />
          <LDCLogo isotipoSize="sm" className="hidden md:flex" />
        </Link>

        {/* Navigation Menu - Desktop Only (hidden on mobile, visible from md breakpoint) */}
        <div className="hidden md:block">
          <LDCNavMenu />
        </div>

        {/* Right Section - Theme Toggle, Mobile Menu & Publish Button */}
        <div className="flex items-center gap-4">
          <LDCThemeModeToggler />

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <LDCCTAButton text="Publicar" href="/publicar" />
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <LDCMobileMenu />
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
