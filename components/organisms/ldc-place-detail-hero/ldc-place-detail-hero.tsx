import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCPlaceTypeChip } from "@/components/atoms/ldc-place-type-chip";
import { LDCFavoriteButton } from "@/components/molecules/ldc-favorite-button";
import { LDCPlaceFacts } from "@/components/molecules/ldc-place-facts";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { LDCPageHero } from "@/components/organisms/ldc-page-hero";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";
import type { IPlace } from "@/interfaces/place";

interface LDCPlaceDetailHeroProps {
  place: IPlace;
  breadcrumbs: IBreadcrumbItem[];
  /** Día de hoy en Chile (0 = lunes) al renderizar en el servidor */
  today: number;
  className?: string;
}

/**
 * LDCPlaceDetailHero - Hero de la ficha de un lugar (alternativa B de CLGDC-207)
 *
 * Chip tintado del tipo y «Destacado», título, dirección con enlace a la ciudad, compartir y
 * guardar en favoritos (`kind="PLACE"`, pill) y, debajo, los datos rápidos (`LDCPlaceFacts`): hoy,
 * cómo llegar y emergencia o teléfono.
 *
 * @example
 * <LDCPlaceDetailHero place={place} breadcrumbs={breadcrumbs} today={today} />
 */
export function LDCPlaceDetailHero({ place, breadcrumbs, today, className }: LDCPlaceDetailHeroProps) {
  return (
    <LDCPageHero breadcrumbs={breadcrumbs} className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <LDCPlaceTypeChip type={place.type} />
        {place.featured && (
          <LDCBadge variant="featured" className="gap-1">
            <Star className="size-3 fill-current" aria-hidden />
            Destacado
          </LDCBadge>
        )}
      </div>

      <h1 className="mb-4 font-mulish text-3xl font-bold text-foreground [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
        {place.title}
      </h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="flex min-w-0 items-start gap-2 text-lg text-muted-foreground">
          <MapPin className="mt-1 size-5 shrink-0 text-pink dark:text-yellow" aria-hidden />
          <span className="[overflow-wrap:anywhere]">
            {place.address} ·{" "}
            <Link
              href={`/ciudad/${place.city.slug}`}
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {place.city.name}
            </Link>
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <LDCSocialShareButtons title={place.title} variant="dark" />
          <LDCFavoriteButton kind="PLACE" targetId={place.id} title={place.title} variant="pill" />
        </div>
      </div>

      <LDCPlaceFacts place={place} today={today} className="mt-6" />
    </LDCPageHero>
  );
}
