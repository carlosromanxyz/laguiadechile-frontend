"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useTransition, type MouseEvent } from "react";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { Button } from "@/components/ui/button";
import type { IPlaceType } from "@/interfaces/place";
import { PLACE_TYPES, PLACE_TYPE_META } from "@/lib/format/places";
import { PLACE_TONE } from "@/lib/ui/places";

export interface LDCPlaceFiltersProps {
  /** Tipo elegido (`?tipo=`); sin él, todos */
  type?: IPlaceType;
  /** Slug de la ciudad elegida (`?ciudad=`); vacío, todas */
  city: string;
  /** Cuántos lugares hay de cada tipo y en total, con la ciudad elegida */
  counts: Record<IPlaceType | "ALL", number>;
  /** Ciudades con lugares */
  cities: readonly { id: string; name: string; slug: string }[];
}

/**
 * LDCPlaceFilters - Filtros de `/lugares` (alternativa B de CLGDC-207)
 *
 * `LDCCombobox` de ciudad y pills de tipo (`LDCStatusFilter` en `lg`: 44 px, con el ícono del tipo
 * y su conteo; en móvil se desplazan en horizontal). Todo vive en la URL (`?tipo=`, `?ciudad=`): el
 * clic simple en una pill navega sin saltar arriba y Cmd/Ctrl + clic abre otra pestaña. «Limpiar
 * filtros» vuelve a `/lugares`.
 *
 * @example
 * <LDCPlaceFilters type="MARKET" city="" counts={counts} cities={cities} />
 */
export function LDCPlaceFilters({ type, city, counts, cities }: LDCPlaceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const cityId = useId();
  const [pending, startTransition] = useTransition();

  function hrefWith(changes: Partial<Record<"tipo" | "ciudad", string>>) {
    const current = { tipo: type ? PLACE_TYPE_META[type].query : "", ciudad: city, ...changes };
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(current)) if (value) params.set(name, value);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const navigate = (href: string) => startTransition(() => router.replace(href, { scroll: false }));

  function interceptPill(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest("a");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(link.getAttribute("href") ?? pathname);
  }

  return (
    <div className="flex flex-col gap-3" aria-busy={pending || undefined}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-64">
          <label htmlFor={cityId} className="sr-only">
            Ciudad
          </label>
          <LDCCombobox
            id={cityId}
            items={[{ id: "", name: "Todas las ciudades", slug: "" }, ...cities]}
            value={city}
            onValueChange={(slug) => navigate(hrefWith({ ciudad: slug }))}
            placeholder="Todas las ciudades"
            searchPlaceholder="Buscar ciudad…"
            emptyText="No hay lugares en esa ciudad."
            className="h-11 bg-card font-normal dark:bg-input/30"
          />
        </div>
        {(type || city) && (
          <Button type="button" variant="ghost" className="h-11 self-start md:self-auto" onClick={() => navigate(pathname)}>
            Limpiar filtros
          </Button>
        )}
      </div>
      <div onClickCapture={interceptPill}>
        <LDCStatusFilter
          label="Filtrar por tipo"
          size="lg"
          scroll
          current={type ?? "ALL"}
          items={[
            { key: "ALL", label: "Todos", count: counts.ALL, href: hrefWith({ tipo: "" }) },
            ...PLACE_TYPES.map((t) => ({
              key: t,
              label: PLACE_TYPE_META[t].plural,
              count: counts[t],
              href: hrefWith({ tipo: PLACE_TYPE_META[t].query }),
              icon: <LDCPlaceTypeIcon type={t} className={PLACE_TONE[t].text} />,
            })),
          ]}
        />
      </div>
    </div>
  );
}
