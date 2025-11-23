import Link from "next/link";
import { cn } from "@/lib/utils";

interface LDCFooterLinkProps {
  /**
   * The destination URL for the footer link
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
 * LDCFooterLink - Footer Link Component
 *
 * A simple link component styled for footer navigation.
 * Features hover effect with orange color transition.
 *
 * @example
 * <LDCFooterLink href="/nosotros" label="Nosotros" />
 */
export function LDCFooterLink({ href, label, className }: LDCFooterLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/80 hover:text-orange transition-colors text-sm",
        className
      )}
    >
      {label}
    </Link>
  );
}
