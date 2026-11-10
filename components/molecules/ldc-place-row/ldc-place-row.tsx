import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { LDCPlaceToday } from "@/components/atoms/ldc-place-today";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import type { IPlace } from "@/interfaces/place";
import { emergencyLabel, telHref } from "@/lib/format/places";
import { PLACE_ACTION_CLASS, PLACE_TONE } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

export interface LDCPlaceRowProps {
  place: IPlace;
  /** Día de hoy en Chile (0 = lunes) al renderizar en el servidor; el navegador lo recalcula */
  today: number;
  className?: string;
}

/**
 * LDCPlaceRow - Fila compacta de un servicio público (alternativa B de CLGDC-207)
 *
 * Sin foto: la baldosa del tipo, el nombre (enlace a la ficha), la dirección y lo de hoy. A la
 * derecha, «Llamar 131» (outline, `tel:`, si tiene número de emergencia) y el botón redondo para
 * llamar a la oficina; los dos de 44 px. Bajo 480 px las acciones bajan bajo el texto.
 *
 * @example
 * <LDCPlaceRow place={place} today={today} />
 */
export function LDCPlaceRow({ place, today, className }: LDCPlaceRowProps) {
  const tone = PLACE_TONE[place.type];
  const emergency = telHref(place.emergencyNumber);
  const phone = telHref(place.phone);

  return (
    <article
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-3.5 rounded-xl border border-border bg-card px-4 py-3.5 min-[480px]:flex-nowrap",
        className,
      )}
    >
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", tone.tint)} aria-hidden>
        <LDCPlaceTypeIcon type={place.type} className={cn("size-5", tone.text)} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="font-mulish text-[15px] font-extrabold leading-snug text-foreground [overflow-wrap:anywhere]">
          <Link href={`/lugar/${place.slug}`} className="hover:text-pink focus-visible:underline dark:hover:text-yellow">
            {place.title}
          </Link>
        </h3>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="[overflow-wrap:anywhere]">{place.address}</span>
        </p>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="[overflow-wrap:anywhere]">
            <LDCPlaceToday schedule={place.schedule} type={place.type} serverToday={today} />
          </span>
        </p>
      </div>
      {(emergency || phone) && (
        <div className="flex w-full shrink-0 items-center gap-2 pl-[3.625rem] min-[480px]:w-auto min-[480px]:pl-0">
          {emergency && place.emergencyNumber && (
            <a
              href={emergency}
              aria-label={`Llamar a ${emergencyLabel(place.emergencyNumber)}, ${place.emergencyNumber}`}
              className={cn(PLACE_ACTION_CLASS, "px-3.5")}
            >
              <Phone className="text-emergency" aria-hidden />
              Llamar <span className="tabular-nums">{place.emergencyNumber}</span>
            </a>
          )}
          {phone && (
            <a
              href={phone}
              aria-label={`Llamar a ${place.title}, ${place.phone}`}
              className={cn(PLACE_ACTION_CLASS, "size-11 px-0")}
            >
              <Phone aria-hidden />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
