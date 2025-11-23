import Link from "next/link";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

/**
 * LDCSocialNetworkIcon - Social Network Icon Link Component
 *
 * Displays a single social media icon wrapped in a styled container.
 * Features a circular background that transitions on hover with the
 * network's brand color.
 *
 * Features:
 * - Circular wrapper with border
 * - Smooth hover transitions (background + icon color)
 * - Accessible link with ARIA label
 * - Brand-specific color on hover
 *
 * @example
 * <LDCSocialNetworkIcon
 *   name="Facebook"
 *   url="https://facebook.com/..."
 *   icon={FaFacebook}
 *   colorClass="hover:bg-blue-500"
 * />
 */

interface LDCSocialNetworkIconProps {
  name: string;
  url: string;
  icon: IconType;
  colorClass: string;
  className?: string;
}

export function LDCSocialNetworkIcon({
  name,
  url,
  icon: Icon,
  colorClass,
  className,
}: LDCSocialNetworkIconProps) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit our ${name} page`}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 transition-all duration-200",
        "text-foreground/60 hover:border-transparent hover:text-white",
        colorClass,
        className
      )}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}
