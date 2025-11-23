import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * LDCAppStoreBadges - App Store Download Badges Component
 *
 * Displays official App Store and Google Play download badges.
 * Links are currently placeholders and should be updated when the apps are published.
 *
 * Features:
 * - Official Apple App Store badge
 * - Official Google Play badge (Spanish localization)
 * - Responsive stacking (vertical on mobile, horizontal on larger screens)
 * - Hover effects
 * - Semantic link structure with proper accessibility attributes
 *
 * @example
 * <LDCAppStoreBadges />
 */

interface LDCAppStoreBadgesProps {
  className?: string;
}

export function LDCAppStoreBadges({ className }: LDCAppStoreBadgesProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 sm:flex-row sm:items-center",
        className
      )}
    >
      {/* App Store Badge */}
      <Link
        href="#" // TODO: Update with actual App Store URL when available
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
        aria-label="Descargar en el App Store"
      >
        <Image
          src="/badges/app-store-badge-es.svg"
          alt="Descargar en el App Store"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </Link>

      {/* Google Play Badge */}
      <Link
        href="#" // TODO: Update with actual Google Play URL when available
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
        aria-label="Disponible en Google Play"
      >
        <Image
          src="/badges/google-play-badge.png"
          alt="Disponible en Google Play"
          width={135}
          height={40}
          className="h-10 w-auto"
        />
      </Link>
    </div>
  );
}
