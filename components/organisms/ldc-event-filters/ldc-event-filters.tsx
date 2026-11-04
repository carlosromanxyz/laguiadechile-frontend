"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useTransition, type MouseEvent } from "react";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { Button } from "@/components/ui/button";
import type { IEventWhen } from "@/interfaces/event";

/** Ventanas «Cuándo», en orden; `proximos` es la de por defecto (no se escribe en la URL). */
const WHEN_OPTIONS: readonly { key: IEventWhen; label: string }[] = [
  { key: "proximos", label: "Próximos" },
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mes" },
  { key: "pasados", label: "Ya pasaron" },
];

interface LDCEventFilterOption {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface LDCEventFiltersProps {
  /** Filtros actuales de la URL (`?cuando=`, `?ciudad=`, `?categoria=`) */
  when: IEventWhen;
  city: string;
  category: string;
  /** Cuántos eventos hay en cada ventana, con la ciudad y la categoría elegidas */
  counts: Record<IEventWhen, number>;
  /** Ciudades y categorías con eventos publicados */
  cities: readonly LDCEventFilterOption[];
  categories: readonly LDCEventFilterOption[];
}

/**
 * LDCEventFilters - Filtros del listado público de eventos (CLGDC-139)
 *
 * Pills «Cuándo» (`LDCStatusFilter`, con su conteo) y dos `LDCCombobox`, ciudad y categoría, como
 * en `LDCAdminListToolbar`. Todo vive en la URL (`?cuando=`, `?ciudad=`, `?categoria=`): se
 * comparte y sobrevive a recargar; el servidor filtra. «Limpiar filtros» vuelve a `/eventos`.
 *
 * @example
 * <LDCEventFilters when="proximos" city="" category="" counts={counts} cities={cities} categories={categories} />
 */
export function LDCEventFilters({ when, city, category, counts, cities, categories }: LDCEventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const cityId = useId();
  const categoryId = useId();
  const [pending, startTransition] = useTransition();

  function hrefWith(changes: Partial<Record<"cuando" | "ciudad" | "categoria", string>>) {
    const current = { cuando: when === "proximos" ? "" : when, ciudad: city, categoria: category, ...changes };
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(current)) if (value) params.set(name, value);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const navigate = (href: string) => startTransition(() => router.replace(href, { scroll: false }));

  /** Las pills son enlaces: el clic simple navega sin saltar arriba; Cmd/Ctrl + clic abre otra pestaña. */
  function interceptPill(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest("a");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(link.getAttribute("href") ?? pathname);
  }

  const filtered = when !== "proximos" || Boolean(city) || Boolean(category);

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
            emptyText="No hay eventos en esa ciudad."
            className="h-11 bg-card font-normal md:h-9 dark:bg-input/30"
          />
        </div>
        <div className="md:w-64">
          <label htmlFor={categoryId} className="sr-only">
            Categoría
          </label>
          <LDCCombobox
            id={categoryId}
            items={[{ id: "", name: "Todas las categorías", slug: "" }, ...categories]}
            value={category}
            onValueChange={(slug) => navigate(hrefWith({ categoria: slug }))}
            placeholder="Todas las categorías"
            searchPlaceholder="Buscar categoría…"
            emptyText="No hay eventos en esa categoría."
            className="h-11 bg-card font-normal md:h-9 dark:bg-input/30"
          />
        </div>
        {filtered && (
          <Button
            type="button"
            variant="ghost"
            className="h-11 self-start md:h-9 md:self-auto"
            onClick={() => navigate(pathname)}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
      <div onClickCapture={interceptPill}>
        <LDCStatusFilter
          label="Filtrar por fecha"
          current={when}
          items={WHEN_OPTIONS.map((o) => ({
            key: o.key,
            label: o.label,
            count: counts[o.key],
            href: hrefWith({ cuando: o.key === "proximos" ? "" : o.key }),
          }))}
        />
      </div>
    </div>
  );
}
