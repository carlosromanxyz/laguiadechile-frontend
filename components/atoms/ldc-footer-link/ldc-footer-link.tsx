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
        // Área de toque de ≥ 24 px de alto sin cambiar el tamaño visual (WCAG 2.5.8, CLGDC-237)
        "relative touch-target",
        "text-foreground/80 hover:text-yellow transition-colors text-sm",
        className
      )}
    >
      {label}
    </Link>
  );
}
