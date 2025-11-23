"use client";

import { cn } from "@/lib/utils";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronRight, Star } from "lucide-react";
import { isNewListing, isUpdatedListing } from "@/services/featured-listings";
import { getIcon } from "@/lib/get-icon";

interface LDCListingCardProps {
  /** Listing title */
  title: string;
  /** Listing slug for URL */
  slug: string;
  /** Type: comercio or servicio */
  type: "comercio" | "servicio";
  /** Category info */
  category: {
    name: string;
    slug: string;
    icon: string;
  };
  /** City info */
  city: {
    name: string;
    slug: string;
  };
  /** Image URL */
  image: string;
  /** Is featured */
  featured: boolean;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCListingCard - Featured Listing Card Component
 *
 * Card displaying a business/service listing with image, badges, and information.
 * Features hover effects and responsive image loading.
 *
 * @example
 * ```tsx
 * <LDCListingCard
 *   title="Restaurante El Buen Sabor"
 *   slug="restaurante-el-buen-sabor"
 *   type="comercio"
 *   category={{ name: "Restaurantes", slug: "restaurantes", icon: "MdRestaurant" }}
 *   city={{ name: "Santiago", slug: "santiago" }}
 *   image="/images/restaurante.jpg"
 *   featured={true}
 *   createdAt="2024-11-15T10:00:00Z"
 *   updatedAt="2024-11-20T15:30:00Z"
 * />
 * ```
 */
export function LDCListingCard({
  title,
  slug,
  type,
  category,
  city,
  image,
  featured,
  createdAt,
  updatedAt,
  className,
}: LDCListingCardProps) {
  const isNew = isNewListing(createdAt);
  const isUpdated = isUpdatedListing(createdAt, updatedAt);

  return (
    <div
      className={cn(
        "group bg-card dark:bg-neutral-800 rounded-xl overflow-hidden border border-border",
        className
      )}
    >
      {/* Image */}
      <Link href={`/${type}/${slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={`${title} - ${category.name} en ${city.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          quality={85}
        />

        {/* Badges Overlay - Top */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 flex-wrap z-10">
          {featured && (
            <LDCBadge variant="featured">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </LDCBadge>
          )}
          {isNew && <LDCBadge variant="new">Nuevo</LDCBadge>}
          {isUpdated && <LDCBadge variant="updated">Actualizado</LDCBadge>}
        </div>

        {/* Category Badge - Bottom */}
        <div className="absolute bottom-3 left-3 z-10">
          <LDCBadge variant="default">
            {renderCategoryIcon(category.icon)}
            {category.name}
          </LDCBadge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold font-mulish mb-3 truncate text-foreground">
          {title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
          {/* City */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
            <MapPin className="w-4 h-4 flex-shrink-0 text-purple" />
            <span className="truncate">{city.name}</span>
          </div>

          {/* View Details Link */}
          <Link
            href={`/${type}/${slug}`}
            className="flex items-center gap-1 text-sm text-purple hover:text-pink transition-colors flex-shrink-0"
          >
            <span>Ver detalles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to render category icon - keeps component creation out of render
function renderCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
