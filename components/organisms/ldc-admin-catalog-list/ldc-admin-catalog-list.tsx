"use client";

import { SearchX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { LDCAdminListToolbar } from "@/components/molecules/ldc-admin-list-toolbar";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPagination } from "@/components/molecules/ldc-pagination";
import { Button } from "@/components/ui/button";

export interface LDCAdminCatalogListProps {
  /** Nombre accesible del listado («Listado de regiones») */
  label: string;
  /** Sustantivo para el anuncio del total («región» / «regiones») */
  noun: { one: string; many: string };
  /** Búsqueda actual (`?q=`) */
  q: string;
  /** Etiqueta y placeholder de la búsqueda */
  searchLabel?: string;
  /** Filtro de ciudad (`?ciudad=`); sin `cities`, no hay filtro */
  city?: string;
  cities?: readonly { id: string; name: string; slug: string }[];
  /** Total con los filtros actuales */
  total: number;
  page: number;
  pageSize: number;
  /** La tabla de la página (`LDCResourceTable` con filas y `renderCard`), renderizada en el servidor */
  children: ReactNode;
  /** La misma tabla con `loading` (esqueleto), que se ve mientras llega la página nueva */
  skeleton: ReactNode;
  /** Estado vacío sin filtros («Aún no hay regiones») */
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}

/**
 * LDCAdminCatalogList - Listado del catálogo admin (alternativa B de CLGDC-114, CLGDC-126)
 *
 * Regiones, Ciudades, Noticias y Propiedades: `LDCAdminListToolbar` (búsqueda y, si se pasan
 * `cities`, ciudad), la tabla que arma la página en el servidor (`LDCResourceTable` con el menú `⋯`
 * de `LDCResourceRowActions` y tarjetas bajo `md`) y `LDCPagination`. Los filtros y la página viven
 * en la URL; mientras llega la página nueva se ve `skeleton`. Vacíos: sin registros, o sin
 * resultados con los filtros (con «Limpiar filtros»).
 *
 * @example
 * <LDCAdminCatalogList label="Listado de regiones" noun={{ one: "región", many: "regiones" }} q=""
 *   total={16} page={1} pageSize={20} skeleton={<LDCResourceTable loading … />} …>
 *   <LDCResourceTable rows={regions} … />
 * </LDCAdminCatalogList>
 */
export function LDCAdminCatalogList({
  label,
  noun,
  q,
  searchLabel,
  city = "",
  cities,
  total,
  page,
  pageSize,
  children,
  skeleton,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: LDCAdminCatalogListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const filterNavigate = (href: string) =>
    startTransition(() => router.replace(href, { scroll: false }));
  const pageNavigate = (href: string) => startTransition(() => router.push(href));

  const filtered = Boolean(q || city);
  const cityName = cities?.find((c) => c.slug === city)?.name;
  const noResults = [q && `«${q}»`, cityName && `en ${cityName}`].filter(Boolean).join(" ");

  let body: ReactNode = children;
  if (pending) body = skeleton;
  else if (total === 0) {
    body = (
      <div className="rounded-lg border bg-card">
        {filtered ? (
          <LDCEmptyState
            className="py-12"
            icon={<SearchX className="size-8 text-muted-foreground" aria-hidden />}
            title={`Sin resultados ${noResults}`}
            description="Prueba con otro nombre o quita algún filtro."
            action={
              <Button
                variant="outline"
                className="mt-6 h-11 md:h-9"
                onClick={() => filterNavigate(pathname)}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <LDCEmptyState className="py-12" icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    );
  }

  return (
    <section aria-label={label} className="flex flex-col gap-4">
      <LDCAdminListToolbar
        q={q}
        city={city}
        cities={cities}
        onNavigate={filterNavigate}
        searchLabel={searchLabel}
      />

      <p className="sr-only" aria-live="polite">
        {pending ? `Cargando ${noun.many}` : `${total} ${total === 1 ? noun.one : noun.many}`}
      </p>

      {body}

      {!pending && total > 0 && (
        <LDCPagination page={page} pageSize={pageSize} total={total} onNavigate={pageNavigate} />
      )}
    </section>
  );
}
