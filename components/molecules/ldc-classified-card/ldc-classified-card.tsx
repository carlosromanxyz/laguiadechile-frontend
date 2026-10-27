"use client";

import { cn } from "@/lib/utils";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCDetailsLink } from "@/components/atoms/ldc-details-link";
import { LDCLocationLink } from "@/components/atoms/ldc-location-link";
import Link from "next/link";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { ClassifiedType, ClassifiedPriceType } from "@/interfaces/classified";
import {
  formatClassifiedPrice,
  getClassifiedTypeBadgeLabel,
  getRelativeTime,
} from "@/lib/format/classifieds";

interface LDCClassifiedCardProps {
  /** Classified title */
  title: string;
  /** Classified slug for URL */
  slug: string;
  /** Type: vendo, compro, arriendo, busco, ofrezco */
  type: ClassifiedType;
  /** Category info */
  category: {
    name: string;
    slug: string;
  };
  /** City info */
  city: {
    name: string;
    slug: string;
  };
  /** Commune (optional) */
  commune?: string;
  /** Image URL */
  image: string;
  /** Price info */
  price: {
    type: ClassifiedPriceType;
    amount?: number;
  };
  /** Is featured */
  featured: boolean;
  /** Created date ISO string */
  createdAt: string;
  /** Optional className for custom styling */
  className?: string;
}

const priceTypeColors: Record<ClassifiedPriceType, string> = {
  fixed: "text-foreground",
  free: "text-emerald-600 dark:text-emerald-400",
  negotiable: "text-muted-foreground",
  contact: "text-muted-foreground",
};

/**
 * LDCClassifiedCard - Horizontal Classified Card Component
 *
 * Displays a classified listing in horizontal card format.
 * Responsive: horizontal on desktop, stacked on mobile.
 *
 * @example
 * ```tsx
 * <LDCClassifiedCard
 *   title="iPhone 13 Pro Max"
 *   slug="iphone-13-pro-max"
 *   type="vendo"
 *   category={{ name: "Electrónica", slug: "electronica" }}
 *   city={{ name: "Santiago", slug: "santiago" }}
 *   commune="Providencia"
 *   image="/images/iphone.jpg"
 *   price={{ type: "fixed", amount: 650000 }}
 *   featured={true}
 *   createdAt="2024-12-24T10:00:00Z"
 * />
 * ```
 */
export function LDCClassifiedCard({
  title,
  slug,
  type,
  category,
  city,
  commune,
  image,
  price,
  featured,
  createdAt,
  className,
}: LDCClassifiedCardProps) {
  const formattedPrice = formatClassifiedPrice(price);
  const relativeTime = getRelativeTime(createdAt);
  const location = commune ? `${city.name}, ${commune}` : city.name;

  return (
    <LDCCardSurface variant="horizontal" className={className}>
      {/* Image */}
      <Link
        href={`/aviso/${slug}`}
        className="relative w-full sm:w-40 md:w-48 flex-shrink-0 aspect-square sm:aspect-auto"
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          quality={80}
        />

        {/* Featured badge on image */}
        {featured && (
          <LDCBadge as="div" variant="featured-overlay">
            <Star className="w-3 h-3 fill-current" />
            Destacado
          </LDCBadge>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Type badge */}
          <LDCBadge variant={`classified-${type}`}>{getClassifiedTypeBadgeLabel(type)}</LDCBadge>

          {/* Title */}
          <h3 className="font-bold font-mulish text-foreground line-clamp-2 sm:line-clamp-1">
            <Link href={`/aviso/${slug}`} className="hover:text-pink dark:hover:text-yellow transition-colors">
              {title}
            </Link>
          </h3>

          {/* Location and time */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <LDCLocationLink href={`/ciudad/${city.slug}`} variant="compact">
              {location}
            </LDCLocationLink>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{relativeTime}</span>
            </span>
          </div>
        </div>

        {/* Price and action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-3 sm:text-right">
          {/* Price */}
          <span
            className={cn(
              "text-lg sm:text-xl font-bold font-mulish",
              priceTypeColors[price.type]
            )}
          >
            {formattedPrice}
          </span>

          {/* View link */}
          <LDCDetailsLink href={`/aviso/${slug}`} label="Ver más" variant="compact" />
        </div>
      </div>
    </LDCCardSurface>
  );
}
