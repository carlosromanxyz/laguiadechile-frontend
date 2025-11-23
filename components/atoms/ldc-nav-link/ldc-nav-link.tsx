"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LDCNavLinkProps {
  /**
   * The destination URL for the navigation link
   */
  href: string;

  /**
   * The text label to display
   */
  label: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LDCNavLink - Navigation Link Component
 *
 * An individual navigation link with automatic active state detection.
 * Highlights the current page using Next.js usePathname hook.
 *
 * Features:
 * - Automatic active state based on current pathname
 * - Orange highlight for active links
 * - Smooth hover transitions
 * - Accessible navigation
 *
 * @example
 * <LDCNavLink href="/nosotros" label="Nosotros" />
 *
 * @example
 * // With custom styling
 * <LDCNavLink href="/contacto" label="Contacto" className="text-lg" />
 */
export function LDCNavLink({ href, label, className }: LDCNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors rounded-md",
        "hover:text-orange hover:bg-accent",
        isActive ? "text-orange bg-accent/50" : "text-foreground/80",
        className
      )}
    >
      {label}
    </Link>
  );
}
