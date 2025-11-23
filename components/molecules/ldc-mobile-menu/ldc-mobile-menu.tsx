"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { LDCNavLink } from "@/components/atoms/ldc-nav-link";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { navigationItems } from "@/config/navigation";

/**
 * LDCMobileMenu - Mobile Navigation Menu Component
 *
 * A responsive mobile menu component that displays a hamburger button and slides in
 * a navigation sheet from the right side. This is a Client Component that manages
 * the open/close state of the sheet.
 *
 * Why Client Component:
 * - Uses useState hook to manage the sheet open/close state
 * - Requires interactivity for the hamburger button click handler
 * - Needs to auto-close when navigation links are clicked
 *
 * Features:
 * - Hamburger icon button trigger using FaBars from react-icons
 * - Sheet slides in from the right side
 * - Displays all navigation items vertically using LDCNavLink
 * - Includes "Publicar" CTA button at the footer
 * - Auto-closes when any navigation link is clicked
 * - Fully typed with TypeScript
 * - Accessible with proper ARIA labels
 *
 * @example
 * <LDCMobileMenu />
 *
 * @example
 * // Typically used in the header component
 * <header>
 *   <LDCLogo />
 *   <LDCMobileMenu />
 * </header>
 */
export function LDCMobileMenu() {
  const [open, setOpen] = useState(false);

  /**
   * Handles navigation link clicks by closing the sheet
   * This provides a smooth user experience when navigating
   */
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de navegación"
        className="text-foreground hover:text-yellow"
      >
        <FaBars className="h-5 w-5" />
      </Button>

      {/* Mobile Menu Sheet - slides from right */}
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold text-orange">
            Menú
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 py-6">
          {navigationItems.map((item) => (
            <div key={item.href} onClick={handleLinkClick}>
              <LDCNavLink
                href={item.href}
                label={item.label}
                className="w-full justify-start text-base"
              />
            </div>
          ))}
        </nav>

        {/* CTA Button in Footer */}
        <SheetFooter className="sm:flex-col">
          <LDCCTAButton
            text="Publicar"
            href="/publicar"
            className="w-full justify-center"
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
