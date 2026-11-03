"use client";

import { SearchX, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCAdminListToolbar } from "@/components/molecules/ldc-admin-list-toolbar";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPagination } from "@/components/molecules/ldc-pagination";
import { LDCPublicationStatusActions } from "@/components/molecules/ldc-publication-status-actions";
import { LDCRejectionReasonDialog } from "@/components/molecules/ldc-rejection-reason-dialog";
import { LDCResourceTable } from "@/components/organisms/ldc-resource-table";
import { Button } from "@/components/ui/button";
import {
  ADMIN_PUBLICATION_STATUSES,
  type IAdminCityOption,
  type IAdminListingRow,
  type IAdminPublicationStatus,
} from "@/interfaces/admin-publication";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import {
  ADMIN_PUBLICATION_STATUS_META,
  ADMIN_STATUS_ALL,
} from "@/lib/dashboard/admin-publication-status";
import { formatShortDate } from "@/lib/dashboard/dates";

export interface LDCAdminPublicationListProps {
  /** Filas de la página actual */
  items: IAdminListingRow[];
  /** Total con los filtros actuales (incluido el de estado) */
  total: number;
  page: number;
  pageSize: number;
  /** Conteos por estado con los mismos filtros, sin el de estado (`counts` de la API) */
  counts: Partial<Record<IAdminPublicationStatus, number>>;
  /** Filtros de la URL: búsqueda, slug de ciudad y estado (`null`, todos) */
  q: string;
  city: string;
  status: IAdminPublicationStatus | null;
  cities: readonly IAdminCityOption[];
  /** Prefijo de la página pública de cada fila (`/comercio`, `/servicio`) */
  publicPathPrefix: string;
  /** Server action del cambio de estado */
  onSetStatus: (
    id: string,
    slug: string,
    status: IAdminPublicationStatus,
    reason?: string,
  ) => Promise<IDashboardActionResult>;
  /** Estado vacío sin filtros («Aún no hay comercios») */
  emptyTitle: string;
  emptyDescription: string;
  /** Ícono del estado vacío, ya renderizado */
  emptyIcon: ReactNode;
  /** Nombre accesible del listado («Listado de comercios») */
  label: string;
}

/** Badge del estado; «Rechazada» con motivo es el botón que abre el motivo (solo lectura). */
function StatusBadge({ row }: { row: IAdminListingRow }) {
  const meta = ADMIN_PUBLICATION_STATUS_META[row.status];
  if (row.status === "REJECTED" && row.rejectionReason) {
    return <LDCRejectionReasonDialog title={row.title} reason={row.rejectionReason} badgeLabel={meta.label} />;
  }
  return <LDCBadge variant={meta.badge}>{meta.label}</LDCBadge>;
}

function FeaturedBadge() {
  return (
    <LDCBadge variant="featured-icon">
      <Star className="size-2.5 fill-current" aria-hidden />
      Destacada
    </LDCBadge>
  );
}

/**
 * LDCAdminPublicationList - Listado admin de publicaciones (alternativa B de CLGDC-114)
 *
 * Junta `LDCAdminListToolbar` (búsqueda, ciudad y estado con los `counts`), `LDCResourceTable` (desde
 * `md`: Ficha, Estado, Dueño desde `xl`, Actualizada y la columna de acciones de ancho fijo a la
 * derecha; bajo `md`, tarjetas `LDCDashboardListItem`) y `LDCPagination`. Cada fila lleva
 * `LDCPublicationStatusActions`. Los filtros y la página viven en la URL; mientras la página nueva
 * llega del servidor, la tabla muestra su esqueleto. Vacíos: sin fichas, o sin resultados con los
 * filtros (con «Limpiar filtros»).
 *
 * @example
 * <LDCAdminPublicationList items={page.items} total={page.total} page={1} pageSize={20}
 *   counts={page.counts} q="" city="" status={null} cities={cities} publicPathPrefix="/comercio"
 *   onSetStatus={setAdminListingStatusAction} emptyTitle="Aún no hay comercios" … />
 */
export function LDCAdminPublicationList({
  items,
  total,
  page,
  pageSize,
  counts,
  q,
  city,
  status,
  cities,
  publicPathPrefix,
  onSetStatus,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  label,
}: LDCAdminPublicationListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const filterNavigate = (href: string) =>
    startTransition(() => router.replace(href, { scroll: false }));
  const pageNavigate = (href: string) => startTransition(() => router.push(href));

  const allCount = ADMIN_PUBLICATION_STATUSES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
  // «Archivadas» (CLGDC-157) aparece cuando la API trae su conteo.
  const statusFilters = ADMIN_PUBLICATION_STATUSES.filter(
    (s) => s !== "ARCHIVED" || counts.ARCHIVED !== undefined || status === "ARCHIVED",
  );
  const filtered = Boolean(q || city || status);
  const cityName = cities.find((c) => c.slug === city)?.name;
  const publicHref = (row: IAdminListingRow) => `${publicPathPrefix}/${row.slug}`;

  const actions = (row: IAdminListingRow) => (
    <LDCPublicationStatusActions
      id={row.id}
      slug={row.slug}
      title={row.title}
      status={row.status}
      publicHref={publicHref(row)}
      onSetStatus={onSetStatus}
      className="md:flex-nowrap"
    />
  );

  const noResults = [
    q && `«${q}»`,
    cityName && `en ${cityName}`,
    status && `con estado «${ADMIN_PUBLICATION_STATUS_META[status].label}»`,
  ]
    .filter(Boolean)
    .join(" ");

  const emptyState = filtered ? (
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
  );

  return (
    <section aria-label={label} className="flex flex-col gap-4">
      <LDCAdminListToolbar
        q={q}
        city={city}
        cities={cities}
        status={status ? ADMIN_PUBLICATION_STATUS_META[status].key : ADMIN_STATUS_ALL}
        allKey={ADMIN_STATUS_ALL}
        statusItems={[
          { key: ADMIN_STATUS_ALL, label: "Todos", count: allCount },
          ...statusFilters.map((s) => ({
            key: ADMIN_PUBLICATION_STATUS_META[s].key,
            label: ADMIN_PUBLICATION_STATUS_META[s].pill,
            count: counts[s] ?? 0,
          })),
        ]}
        onNavigate={filterNavigate}
      />

      <p className="sr-only" aria-live="polite">
        {pending ? "Cargando fichas" : `${total} ${total === 1 ? "ficha" : "fichas"}`}
      </p>

      <LDCResourceTable
        rows={items}
        getRowKey={(row) => row.id}
        loading={pending}
        loadingLabel="Cargando fichas"
        caption={`${label}, de la última actualizada a la más antigua`}
        emptyState={emptyState}
        isRowHighlighted={(row) => row.featured}
        columns={[
          {
            key: "title",
            header: "Ficha",
            cellClassName: "w-full max-w-0",
            cell: (row) => (
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={row.image}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-md bg-muted object-cover"
                />
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    {row.status === "PUBLISHED" ? (
                      <Link
                        href={publicHref(row)}
                        title={row.title}
                        className="truncate font-bold hover:underline focus-visible:underline"
                      >
                        {row.title}
                      </Link>
                    ) : (
                      <span title={row.title} className="truncate font-bold">
                        {row.title}
                      </span>
                    )}
                    {row.featured && <FeaturedBadge />}
                  </div>
                  <p className="truncate font-open-sans text-xs text-muted-foreground">
                    {row.category.name} · {row.city.name}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "status",
            header: "Estado",
            cell: (row) => <StatusBadge row={row} />,
          },
          {
            key: "owner",
            header: "Dueño",
            // Desde `xl`: entre 1024 y 1279 el panel deja ~770 px y el nombre necesita el ancho.
            headClassName: "hidden xl:table-cell",
            cellClassName: "hidden max-w-40 truncate xl:table-cell",
            cell: (row) =>
              row.owner ? row.owner.name : <span className="text-muted-foreground">Sin dueño</span>,
          },
          {
            key: "updatedAt",
            header: "Actualizada",
            cellClassName: "whitespace-nowrap text-muted-foreground",
            cell: (row) => <time dateTime={row.updatedAt}>{formatShortDate(row.updatedAt)}</time>,
          },
        ]}
        renderActions={actions}
        actionsClassName="w-[15rem]"
        renderCard={(row) => (
          <LDCDashboardListItem
            image={row.image}
            title={row.title}
            meta={
              <>
                <StatusBadge row={row} />
                {row.featured && <FeaturedBadge />}
              </>
            }
            subtitle={[
              `${row.category.name} · ${row.city.name}`,
              formatShortDate(row.updatedAt),
              row.owner ? row.owner.name : "Sin dueño",
            ].join(" · ")}
            actions={actions(row)}
          />
        )}
      />

      {!pending && items.length > 0 && (
        <LDCPagination page={page} pageSize={pageSize} total={total} onNavigate={pageNavigate} />
      )}
    </section>
  );
}
