import { cn } from "@/lib/utils";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { getOperationLabel, getPropertyTypeLabel } from "@/services/properties";
import Link from "next/link";
import { Star, Sparkles, MapPin } from "lucide-react";
import type { IProperty } from "@/interfaces/property";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LDCPropertyDetailHeroProps {
  property: IProperty;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

/**
 * LDCPropertyDetailHero - Hero Section for Property Detail Pages
 *
 * Shows operation/type badges, featured/new flags, title, location and share.
 * Unlike listing/classified heroes, properties have no category icon.
 */
export function LDCPropertyDetailHero({
  property,
  breadcrumbs,
  className,
}: LDCPropertyDetailHeroProps) {
  const { location } = property;
  const locationText = [location.neighborhood, location.commune]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      className={cn(
        "relative w-full bg-purple/20 pt-24 pb-8 md:pt-28 md:pb-12",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumbs */}
        <LDCBreadcrumbs items={breadcrumbs} variant="light" className="mb-6" />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LDCBadge variant="default">
            {getPropertyTypeLabel(property.type)} en{" "}
            {getOperationLabel(property.operation).toLowerCase()}
          </LDCBadge>
          {property.featured && (
            <LDCBadge variant="featured">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </LDCBadge>
          )}
          {property.isNew && (
            <LDCBadge variant="new">
              <Sparkles className="w-3 h-3 mr-1" />
              Nuevo
            </LDCBadge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mulish text-foreground mb-4">
          {property.title}
        </h1>

        {/* Location & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href={`/ciudad/${location.city.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-5 h-5 text-pink" />
            <span className="text-lg">
              {locationText ? `${locationText}, ` : ""}
              {location.city.name}
            </span>
          </Link>

          <LDCSocialShareButtons title={property.title} variant="dark" />
        </div>
      </div>
    </section>
  );
}
