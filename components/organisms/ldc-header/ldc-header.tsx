"use client";

/**
 * LDCHeader Component (Responsive)
 *
 * Sticky header component that combines logo, navigation menu, theme toggle, and CTA button.
 * Composed of atomic and molecular components following Atomic Design methodology.
 *
 * Features:
 * - Sticky header with fixed positioning
 * - Scroll-based background opacity (solid white at top, semi-transparent when scrolled)
 * - Responsive design: full menu on desktop (md+), mobile menu on mobile
 * - Logo, navigation menu, and publish CTA button
 * - Active link highlighting (delegated to LDCNavLink)
 * - Mobile hamburger menu with slide-in sheet
 * - Smooth hover transitions
 * - Professional, clean design for all screen sizes
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCThemeModeToggler } from "@/components/molecules/ldc-theme-mode-toggler";
import { LDCNavMenu } from "@/components/molecules/ldc-nav-menu";
import { LDCMobileMenu } from "@/components/molecules/ldc-mobile-menu";

export function LDCHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);

    const handleScroll = () => {
      // Consider scrolled after hero section (viewport height)
      setIsScrolled(window.scrollY > window.innerHeight);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4">
      {/* Floating backdrop wrapper with rounded corners, background, opacity and blur */}
      <div className={cn(
        "container mx-auto max-w-7xl rounded-full border border-border/40 transition-all duration-300",
        mounted && isScrolled
          ? "bg-white/40 dark:bg-black/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/30 dark:supports-[backdrop-filter]:bg-black/30"
          : "bg-white dark:bg-black/40 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-black/30"
      )}>
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
