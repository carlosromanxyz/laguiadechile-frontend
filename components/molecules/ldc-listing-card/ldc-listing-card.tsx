"use client";

import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCDetailsLink } from "@/components/atoms/ldc-details-link";
import { LDCLocationLink } from "@/components/atoms/ldc-location-link";
import { LDCFavoriteButton } from "@/components/molecules/ldc-favorite-button";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, MapPin, Star } from "lucide-react";
import { isNewListing, isUpdatedListing } from "@/lib/format/listings";
import { getIcon } from "@/lib/get-icon";
import { cn } from "@/lib/utils";

interface LDCListingCardProps {
  /**
   * Id (UUID) de la ficha, para el corazón de favoritos. Sin id (vista previa de una ficha
   * nueva) no hay corazón.
   */
  id?: string;
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
  /** Image URL. Vacía (vista previa de una ficha nueva sin foto), se ve un marcador gris. */
  image: string;
  /** Is featured */
  featured: boolean;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
  /** Optional className for custom styling */
  className?: string;
  /**
   * Vista previa (panel del comercio): «Ver detalles» llama a esto en vez de navegar, y la imagen
   * y la ciudad no son enlaces, para no salir del formulario.
   */
  onDetailsClick?: () => void;
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
 *   id="2fafc47f-ce62-4f68-b7e5-95140374b868"
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
  id,
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
  onDetailsClick,
}: LDCListingCardProps) {
  const isNew = isNewListing(createdAt);
  const isUpdated = isUpdatedListing(createdAt, updatedAt);
  const imageClassName = "block relative aspect-[4/3] overflow-hidden bg-muted";
  // En la vista previa no se guarda nada: sin corazón.
  const showFavorite = Boolean(id) && !onDetailsClick;

  const media = (
    <>
      {image ? (
        <Image
          src={image}
          alt={`${title} - ${category.name} en ${city.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          quality={85}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <ImageIcon className="size-10" aria-hidden />
        </div>
      )}

      {/* Badges Overlay - Top (right-13 deja sitio al corazón) */}
      <div
        className={cn(
          "absolute top-2 left-2 flex gap-1.5 flex-wrap z-10",
          showFavorite ? "right-13" : "right-2"
        )}
      >
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
    </>
  );

  return (
    <LDCCardSurface as="div" className={className}>
      {/* Image */}
      {onDetailsClick ? (
        <div className={imageClassName}>{media}</div>
      ) : (
        <div className="relative">
          <Link href={`/${type}/${slug}`} className={imageClassName}>
            {media}
          </Link>
          {showFavorite && id && <LDCFavoriteButton kind="LISTING" targetId={id} title={title} />}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold font-mulish mb-3 truncate text-foreground">
          {title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
          {/* City */}
          {onDetailsClick ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0 text-pink dark:text-yellow" aria-hidden />
              <span className="truncate">{city.name}</span>
            </span>
          ) : (
            <LDCLocationLink href={`/ciudad/${city.slug}`}>{city.name}</LDCLocationLink>
          )}

          {/* View Details Link */}
          <LDCDetailsLink href={`/${type}/${slug}`} onClick={onDetailsClick} />
        </div>
      </div>
    </LDCCardSurface>
  );
}

// Helper function to render category icon - keeps component creation out of render
function renderCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
