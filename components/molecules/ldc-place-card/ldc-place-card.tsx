import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCPlaceToday } from "@/components/atoms/ldc-place-today";
import { LDCPlaceTypeChip } from "@/components/atoms/ldc-place-type-chip";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import { LDCWeekDays } from "@/components/atoms/ldc-week-days";
import { LDCFavoriteButton } from "@/components/molecules/ldc-favorite-button";
import type { IPlace } from "@/interfaces/place";
import { PLACE_TYPE_META, emergencyLabel, telHref } from "@/lib/format/places";
import { PLACE_ACTION_CLASS, PLACE_TONE } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

export interface LDCPlaceCardProps {
  place: IPlace;
  /** Día de hoy en Chile (0 = lunes) al renderizar en el servidor; el navegador lo recalcula */
  today: number;
  className?: string;
}

/** «Comuna · Ciudad», sin repetir si la comuna es la ciudad. */
export function placeWhere(place: Pick<IPlace, "commune" | "city">): string {
  return place.commune && place.commune !== place.city.name
    ? `${place.commune} · ${place.city.name}`
    : place.city.name;
}

/**
 * LDCPlaceCard - Tarjeta de un lugar (alternativa B de CLGDC-207)
 *
 * Foto 16:9 (sin foto, la baldosa del tipo con su ícono), «Destacado» arriba a la izquierda y el
 * corazón de favoritos (`overlay-solid`: card sólida, 44 px, sin blur) arriba a la derecha. Debajo,
 * el chip tintado del tipo, el nombre en dos líneas, comuna · ciudad y lo de hoy: en una feria, los
 * días (`LDCWeekDays`) y «Hoy hay feria» o la próxima; en lo demás, «Hoy 10:00 - 18:00 · resumen».
 * Un servicio público con número de emergencia suma «Llamar 131» (outline, 44 px, `tel:`).
 *
 * Server Component (el día de hoy y el corazón son islas cliente).
 *
 * @example
 * <LDCPlaceCard place={place} today={today} />
 */
export function LDCPlaceCard({ place, today, className }: LDCPlaceCardProps) {
  const href = `/lugar/${place.slug}`;
  const meta = PLACE_TYPE_META[place.type];
  const tone = PLACE_TONE[place.type];
  const emergency = place.type === "PUBLIC_SERVICE" ? telHref(place.emergencyNumber) : undefined;

  return (
    <LDCCardSurface className={cn("min-w-0", className)}>
      <div className="relative">
        <Link href={href} className="relative block aspect-video overflow-hidden bg-muted" tabIndex={-1} aria-hidden>
          {place.image ? (
            <Image
              src={place.image}
              alt={`${place.title}, ${meta.label.toLowerCase()} en ${place.city.name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
              quality={85}
            />
          ) : (
            <span className={cn("absolute inset-0 grid place-items-center", tone.tint)}>
              <LDCPlaceTypeIcon type={place.type} className={cn("size-10", tone.text)} />
            </span>
          )}
        </Link>
        {place.featured && (
          <span className="absolute left-2 top-2 z-10">
            <LDCBadge variant="featured" className="gap-1">
              <Star className="size-3 fill-current" aria-hidden />
              Destacado
            </LDCBadge>
          </span>
        )}
        <LDCFavoriteButton kind="PLACE" targetId={place.id} title={place.title} variant="overlay-solid" />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 px-4 pb-4 pt-3.5">
        <div>
          <LDCPlaceTypeChip type={place.type} />
        </div>
        <h3 className="line-clamp-2 font-mulish text-base font-extrabold leading-snug text-foreground [overflow-wrap:anywhere]">
          <Link href={href} className="hover:text-pink focus-visible:underline dark:hover:text-yellow">
            {place.title}
          </Link>
        </h3>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="[overflow-wrap:anywhere]">{placeWhere(place)}</span>
        </p>
        {place.type === "MARKET" ? (
          <div className="flex flex-wrap items-center gap-2">
            <LDCWeekDays schedule={place.schedule} serverToday={today} />
            <span className="font-open-sans text-[13px] text-muted-foreground">
              <LDCPlaceToday schedule={place.schedule} type={place.type} serverToday={today} />
            </span>
          </div>
        ) : (
          <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
            <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="[overflow-wrap:anywhere]">
              <LDCPlaceToday schedule={place.schedule} type={place.type} serverToday={today} />
            </span>
          </p>
        )}
        {emergency && place.emergencyNumber && (
          <a
            href={emergency}
            aria-label={`Llamar ${place.emergencyNumber}, ${emergencyLabel(place.emergencyNumber)}`}
            className={cn(PLACE_ACTION_CLASS, "mt-1 self-start px-3.5")}
          >
            <Phone className="text-emergency" aria-hidden />
            Llamar <span className="tabular-nums">{place.emergencyNumber}</span>
          </a>
        )}
      </div>
    </LDCCardSurface>
  );
}
