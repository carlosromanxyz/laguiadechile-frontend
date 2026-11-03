import { Building2, Plus, Star } from "lucide-react";
import Image from "next/image";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCAdminCatalogList } from "@/components/organisms/ldc-admin-catalog-list";
import { LDCResourceRowActions } from "@/components/organisms/ldc-resource-row-actions";
import {
  LDCResourceTable,
  type LDCResourceTableColumn,
} from "@/components/organisms/ldc-resource-table";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminCity } from "@/interfaces/admin-catalog";
import {
  CATALOG_PAGE_SIZE,
  normalizeSearch,
  paginateCatalog,
  parseCatalogParams,
} from "@/lib/dashboard/admin-catalog";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { adminCitiesService } from "@/services/admin/cities";
import { deleteCityAction } from "./actions";

export const metadata = {
  title: "Ciudades — Panel",
};

const BASE = "/dashboard/admin/ciudades";

/** Máximo de `GET /cities?limit=` (el catálogo tiene ~350 comunas). */
const CITIES_LIMIT = 500;

const regionText = (c: IAdminCity) =>
  [c.region?.name ?? "Sin región", c.isCapital && "Capital regional"].filter(Boolean).join(" · ");

function rowActions(c: IAdminCity) {
  return {
    editHref: `${BASE}/${c.id}/editar`,
    onDelete: deleteCityAction.bind(null, c.id),
    deleteLabel: `¿Eliminar ${c.name}?`,
    deleteDescription:
      "Esta acción no se puede deshacer. Si tiene fichas, avisos, propiedades o eventos, no se podrá eliminar.",
  };
}

function FeaturedBadge() {
  return (
    <LDCBadge variant="featured-icon">
      <Star className="size-2.5 fill-current" aria-hidden />
      Destacada
    </LDCBadge>
  );
}

const columns: LDCResourceTableColumn<IAdminCity>[] = [
  {
    key: "name",
    header: "Ciudad",
    cellClassName: "w-full max-w-0",
    cell: (c) => (
      <div className="flex min-w-0 items-center gap-3">
        {c.image ? (
          <Image
            src={c.image}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-md bg-muted object-cover"
          />
        ) : (
          <span className="size-10 shrink-0 rounded-md bg-muted" aria-hidden />
        )}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span title={c.name} className="truncate font-bold">
              {c.name}
            </span>
            {c.featured && <FeaturedBadge />}
          </div>
          <p className="truncate font-open-sans text-xs text-muted-foreground">{regionText(c)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    headClassName: "hidden lg:table-cell",
    cellClassName: "hidden font-mono text-xs text-muted-foreground lg:table-cell",
    cell: (c) => c.slug,
  },
];

const renderCard = (c: IAdminCity) => (
  <LDCDashboardListItem
    image={c.image}
    title={c.name}
    meta={c.featured ? <FeaturedBadge /> : undefined}
    subtitle={`${regionText(c)} · ${c.slug}`}
    actions={<LDCResourceRowActions {...rowActions(c)} triggerClassName="size-11 md:size-8" />}
  />
);

interface AdminCiudadesPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/** «Ciudades» del admin (CLGDC-126): listado con búsqueda y paginación en la URL, alta, edición y baja. */
export default async function AdminCiudadesPage({ searchParams }: AdminCiudadesPageProps) {
  const filters = parseCatalogParams(await searchParams);
  const cities = await adminCitiesService.list({ limit: CITIES_LIMIT });
  const needle = normalizeSearch(filters.q);
  const matches = needle
    ? cities.filter((c) => normalizeSearch(`${c.name} ${c.slug} ${c.region?.name ?? ""}`).includes(needle))
    : cities;
  const { items, total, page } = paginateCatalog(matches, filters.page);

  const table = (rows: IAdminCity[], loading = false) => (
    <LDCResourceTable
      rows={rows}
      loading={loading}
      loadingLabel="Cargando ciudades"
      caption="Listado de ciudades: primero las capitales regionales, luego por nombre"
      getRowKey={(c) => c.id}
      columns={columns}
      getRowActions={rowActions}
      renderCard={renderCard}
      isRowHighlighted={(c) => c.featured}
    />
  );

  return (
    <LDCDashboardPageTemplate
      title="Ciudades"
      description="Ciudades y comunas del catálogo, con su región."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCAdminCatalogList
        label="Listado de ciudades"
        noun={{ one: "ciudad", many: "ciudades" }}
        q={filters.q}
        searchLabel="Buscar ciudad o región"
        total={total}
        page={page}
        pageSize={CATALOG_PAGE_SIZE}
        skeleton={table([], true)}
        emptyIcon={<Building2 className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay ciudades"
        emptyDescription="Crea la primera con «Nueva»."
      >
        {table(items)}
      </LDCAdminCatalogList>
    </LDCDashboardPageTemplate>
  );
}
