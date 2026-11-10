"use client";

import Link from "next/link";
import { MapPinned } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCPlaceCard } from "@/components/molecules/ldc-place-card";
import { LDCPlaceRow } from "@/components/molecules/ldc-place-row";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import type { IPlaces, IPlaceType } from "@/interfaces/place";
import { PLACE_TYPES, PLACE_TYPE_META } from "@/lib/format/places";
import { PLACE_FOCUS_CLASS, PLACE_PILL_CLASS, PLACE_PILL_STATE_CLASS, PLACE_TONE, PLACES_ENTER_CLASS, PLACES_GRID_CLASS, PLACES_ROWS_CLASS } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

/** Lugares que se ven por pestaña. */
const PER_TAB = 4;

export interface LDCCityPlacesProps {
  /** Lugares de la ciudad (ya llegaron del servidor; las pestañas solo filtran) */
  places: IPlaces;
  city: { name: string; slug: string };
  /** Día de hoy en Chile (0 = lunes) al renderizar en el servidor */
  today: number;
}

/**
 * LDCCityPlaces - Bloque «Lugares de {ciudad}» de `/ciudad/[slug]` (alternativa B de CLGDC-207)
 *
 * Encabezado como el de «Comercios y Servicios» (baldosa, h2, conteo y «Ver todos →») y pestañas por
 * tipo con su conteo: patrón ARIA de pestañas (`role="tablist"`, `tab` y `tabpanel`, foco itinerante
 * con flechas, Inicio y Fin, activación automática). Cada pestaña muestra hasta 4: tarjetas o, en
 * servicios públicos, filas. Solo se dibujan las pestañas con lugares; sin lugares, nada.
 *
 * Cliente por las pestañas; no consulta de nuevo la API.
 *
 * @example
 * <LDCCityPlaces places={places} city={city} today={today} />
 */
export function LDCCityPlaces({ places, city, today }: LDCCityPlacesProps) {
  const types = PLACE_TYPES.filter((t) => places.some((p) => p.type === t));
  const [current, setCurrent] = useState<IPlaceType | undefined>(types[0]);
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (types.length === 0 || !current) return null;
  const active = types.includes(current) ? current : types[0];
  const shown = places.filter((p) => p.type === active).slice(0, PER_TAB);
  const tabId = (t: IPlaceType) => `${baseId}-tab-${t}`;
  const panelId = `${baseId}-panel`;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = types.indexOf(active);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = (i + 1) % types.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + types.length) % types.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = types.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setCurrent(types[next]);
    tabRefs.current[types[next]]?.focus();
  }

  const headingId = `${baseId}-title`;
  const all = `/lugares?ciudad=${city.slug}`;

  return (
    <LDCSection paddingY="md">
      <LDCSectionHeader
        variant="compact"
        title={`Lugares de ${city.name}`}
        titleId={headingId}
        icon={<MapPinned className={cn("size-5", PLACE_TONE.ATTRACTION.text)} />}
        tileClassName={PLACE_TONE.ATTRACTION.tint}
        subtitle={`${places.length} ${places.length === 1 ? "lugar" : "lugares"} para visitar, hacer trámites o ir a la feria`}
        viewAllHref={all}
      />

      <div
        role="tablist"
        aria-label="Tipo de lugar"
        onKeyDown={onKeyDown}
        className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {types.map((t) => {
          const selected = t === active;
          return (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[t] = el;
              }}
              id={tabId(t)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(t)}
              className={cn(PLACE_PILL_CLASS, selected ? PLACE_PILL_STATE_CLASS.active : PLACE_PILL_STATE_CLASS.idle)}
            >
              <LDCPlaceTypeIcon type={t} className={cn("size-4 shrink-0", PLACE_TONE[t].text)} />
              {PLACE_TYPE_META[t].plural}
              <span className="text-xs font-extrabold text-muted-foreground">
                {places.filter((p) => p.type === t).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className={cn("rounded-xl", PLACE_FOCUS_CLASS)}
      >
        {/* `role="list"`: Safari quita la semántica de las listas sin viñetas */}
        <ul
          role="list"
          className={cn(active === "PUBLIC_SERVICE" ? PLACES_ROWS_CLASS : PLACES_GRID_CLASS, PLACES_ENTER_CLASS)}
        >
          {shown.map((p) => (
            <li key={p.id}>
              {active === "PUBLIC_SERVICE" ? (
                <LDCPlaceRow place={p} today={today} />
              ) : (
                <LDCPlaceCard place={p} today={today} />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link href={all} className="inline-flex min-h-11 items-center text-sm text-pink-strong hover:underline dark:text-yellow">
          Ver los {places.length} lugares →
        </Link>
      </div>
    </LDCSection>
  );
}
