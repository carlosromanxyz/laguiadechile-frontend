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
        "group bg-card dark:bg-neutral-800 rounded-lg overflow-hidden border border-border",
        "hover:shadow-lg transition-all duration-300",
        featured && "ring-2 ring-yellow",
        className
      )}
    >
      {/* Image */}
      <Link href={`/${type}/${slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={`${title} - ${category.name} en ${city.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          quality={85}
        />

        {/* Featured pattern overlay */}
        {featured && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none z-[1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23ffbe0b' fill-opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px',
            }}
          />
        )}

        {/* Badges Overlay - Top */}
        <div className="absolute top-2 left-2 right-2 flex gap-1.5 flex-wrap z-10">
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
        <div className="absolute bottom-2 left-2 z-10">
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
          <Link
            href={`/ciudad/${city.slug}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0 hover:text-pink dark:hover:text-yellow transition-colors"
          >
            <MapPin className="w-4 h-4 flex-shrink-0 text-pink dark:text-yellow" />
            <span className="truncate">{city.name}</span>
          </Link>

          {/* View Details Link */}
          <Link
            href={`/${type}/${slug}`}
            className="group/link flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange dark:hover:text-orange transition-colors flex-shrink-0"
          >
            <span className="md:max-w-0 md:opacity-0 md:group-hover/link:max-w-24 md:group-hover/link:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap">Ver detalles</span>
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
