"use client";

import Link from "next/link";
import { Bed, Bath, Car, Maximize, Star, Sparkles } from "lucide-react";
import { PropertyType, PropertyOperation } from "@/interfaces/property";
import {
  formatPropertyPriceWithPeriod,
  getPropertyTypeLabel,
  getOperationLabel,
} from "@/lib/format/properties";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCFeaturedRibbon } from "@/components/atoms/ldc-featured-ribbon";
import { LDCLocationLink } from "@/components/atoms/ldc-location-link";
import { LDCPropertyImageCarousel } from "@/components/atoms/ldc-property-image-carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LDCPropertyCardProps {
  /** Property title */
  title: string;
  /** Property slug for URL */
  slug: string;
  /** Property type */
  type: PropertyType;
  /** Operation type */
  operation: PropertyOperation;
  /** Price info */
  price: {
    amount: number;
    currency: "uf" | "clp";
    commonExpenses?: number;
    period?: "mes" | "dia" | "semana";
  };
  /** Property features */
  features: {
    surface: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
  };
  /** Location info */
  location: {
    city: {
      name: string;
      slug: string;
    };
    commune: string;
    neighborhood?: string;
  };
  /** Main image URL (fallback if images not provided) */
  image: string;
  /** Array of image URLs for carousel */
  images?: string[];
  /** Is featured */
  featured: boolean;
  /** Is new listing */
  isNew: boolean;
  /** Optional className for custom styling */
  className?: string;
}


/**
 * LDCPropertyCard - Property Listing Card Component
 *
 * Displays a property listing with image, price, features, and location.
 * Vertical card design with prominent image and feature icons.
 *
 * @example
 * ```tsx
 * <LDCPropertyCard
 *   title="Departamento 3D 2B"
 *   slug="departamento-3d-2b"
 *   type="departamento"
 *   operation="venta"
 *   price={{ amount: 6500, currency: "uf" }}
 *   features={{ surface: 95, bedrooms: 3, bathrooms: 2, parking: 2 }}
 *   location={{ city: { name: "Santiago", slug: "santiago" }, commune: "Las Condes" }}
 *   image="/images/depto.jpg"
 *   featured={true}
 *   isNew={false}
 * />
 * ```
 */
export function LDCPropertyCard({
  title,
  slug,
  type,
  operation,
  price,
  features,
  location,
  image,
  images,
  featured,
  isNew,
  className,
}: LDCPropertyCardProps) {
  const formattedPrice = formatPropertyPriceWithPeriod(price);
  const propertyTypeLabel = getPropertyTypeLabel(type);
  const operationLabel = getOperationLabel(operation);
  const locationDetails = location.neighborhood
    ? `${location.commune}, ${location.neighborhood}`
    : location.commune;

  // Use images array if provided, otherwise fallback to single image
  const carouselImages = images && images.length > 0 ? images : [image];

  return (
    <LDCCardSurface featured={featured} className={className}>
      {/* Image Section */}
      <div className="relative">
        <Link href={`/propiedad/${slug}`} className="block">
          <LDCPropertyImageCarousel
            images={carouselImages}
            alt={title}
            aspectRatio="aspect-[4/3]"
            showDots={false}
            showCounter={false}
          >
            {/* Featured pattern overlay */}
            {featured && <LDCFeaturedRibbon />}

            {/* Minimal badges on image - only featured/new with tooltips */}
            {(featured || isNew) && (
              <div className="absolute top-2 right-2 z-10 flex gap-1.5">
                {featured && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LDCBadge variant="featured-icon">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </LDCBadge>
                    </TooltipTrigger>
                    <TooltipContent>Destacado</TooltipContent>
                  </Tooltip>
                )}
                {isNew && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LDCBadge variant="new-icon">
                        <Sparkles className="w-2.5 h-2.5" />
                      </LDCBadge>
                    </TooltipTrigger>
                    <TooltipContent>Nuevo</TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </LDCPropertyImageCarousel>
        </Link>
      </div>

      {/* Content Section - Portal Inmobiliario style */}
      <div className="p-3 space-y-1">
        {/* Price */}
        <p className="text-lg font-bold font-mulish text-foreground">
          {formattedPrice}
        </p>

        {/* Type + Operation */}
        <p className="text-xs text-muted-foreground">
          {propertyTypeLabel} en {operationLabel}
        </p>

        {/* Title */}
        <h3 className="text-sm text-foreground line-clamp-1">
          <Link
            href={`/propiedad/${slug}`}
            className="hover:text-pink dark:hover:text-yellow transition-colors"
          >
            {title}
          </Link>
        </h3>

        {/* Location */}
        <LDCLocationLink
          href={`/ciudad/${location.city.slug}`}
          variant="split"
          details={locationDetails}
        >
          {location.city.name}
        </LDCLocationLink>

        {/* Features - Compact inline with Tooltips */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5 cursor-help">
                <Maximize className="w-3 h-3" />
                {features.surface} m²
              </span>
            </TooltipTrigger>
            <TooltipContent>Superficie útil</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5 cursor-help">
                <Bed className="w-3 h-3" />
                {features.bedrooms}
              </span>
            </TooltipTrigger>
            <TooltipContent>Dormitorios</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5 cursor-help">
                <Bath className="w-3 h-3" />
                {features.bathrooms}
              </span>
            </TooltipTrigger>
            <TooltipContent>Baños</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5 cursor-help">
                <Car className="w-3 h-3" />
                {features.parking}
              </span>
            </TooltipTrigger>
            <TooltipContent>Estacionamientos</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </LDCCardSurface>
  );
}
