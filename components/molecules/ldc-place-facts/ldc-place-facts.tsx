import { CalendarDays, Clock, ExternalLink, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { LDCPlaceToday } from "@/components/atoms/ldc-place-today";
import type { IPlace } from "@/interfaces/place";
import { directionsHref, emergencyLabel, telHref } from "@/lib/format/places";
import { PLACE_ACTION_CLASS, PLACE_TONE } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

interface LDCPlaceFactsProps {
  place: IPlace;
  /** Día de hoy en Chile (0 = lunes) al renderizar en el servidor; el navegador lo recalcula */
  today: number;
  className?: string;
}

function Fact({
  icon,
  label,
  value,
  action,
  tint,
}: {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  action?: ReactNode;
  tint: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg [&_svg]:size-5", tint)} aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-extrabold text-foreground [overflow-wrap:anywhere]">{value}</p>
      </div>
      {action}
    </div>
  );
}

/**
 * LDCPlaceFacts - Datos rápidos bajo el título de un lugar (alternativa B de CLGDC-207)
 *
 * Hasta tres tarjetas, cada una con su acción: hoy (horario o si hay feria, en hora de Chile), cómo
 * llegar (ruta en Google Maps) y, si hay, el número de emergencia del lugar o su teléfono, con un
 * botón outline `tel:`. Todas las acciones miden 44 px.
 *
 * @example
 * <LDCPlaceFacts place={place} today={today} />
 */
export function LDCPlaceFacts({ place, today, className }: LDCPlaceFactsProps) {
  const tone = PLACE_TONE[place.type];
  const tint = cn(tone.tint, tone.text);
  const emergency = place.type === "PUBLIC_SERVICE" ? telHref(place.emergencyNumber) : undefined;
  const phone = telHref(place.phone);
  const third = Boolean((emergency && place.emergencyNumber) || phone);

  return (
    <div className={cn("grid grid-cols-1 gap-3", third ? "md:grid-cols-3" : "md:grid-cols-2", className)}>
      <Fact
        tint={tint}
        icon={place.type === "MARKET" ? <CalendarDays /> : <Clock />}
        label={<LDCPlaceToday schedule={place.schedule} type={place.type} serverToday={today} mode="day" />}
        value={<LDCPlaceToday schedule={place.schedule} type={place.type} serverToday={today} mode="fact" strongClassName="font-extrabold" />}
      />
      <Fact
        tint={tint}
        icon={<Navigation />}
        label="Cómo llegar"
        value={place.commune || place.city.name}
        action={
          <a
            href={directionsHref(place.address, place.city.name)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ruta a ${place.title} en Google Maps (se abre en otra pestaña)`}
            className={PLACE_ACTION_CLASS}
          >
            Ruta
            <ExternalLink aria-hidden />
          </a>
        }
      />
      {emergency && place.emergencyNumber ? (
        <Fact
          tint={tint}
          icon={<Phone className="text-emergency" />}
          label="Emergencias"
          value={emergencyLabel(place.emergencyNumber)}
          action={
            <a
              href={emergency}
              aria-label={`Llamar ${place.emergencyNumber}, ${emergencyLabel(place.emergencyNumber)}`}
              className={PLACE_ACTION_CLASS}
            >
              <Phone className="text-emergency" aria-hidden />
              Llamar <span className="tabular-nums">{place.emergencyNumber}</span>
            </a>
          }
        />
      ) : phone ? (
        <Fact
          tint={tint}
          icon={<Phone />}
          label="Teléfono"
          value={<span className="tabular-nums">{place.phone}</span>}
          action={
            <a href={phone} aria-label={`Llamar a ${place.title}, ${place.phone}`} className={PLACE_ACTION_CLASS}>
              Llamar
            </a>
          }
        />
      ) : null}
    </div>
  );
}
