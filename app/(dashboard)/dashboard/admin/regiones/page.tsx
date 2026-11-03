import { Map, Plus } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCAdminCatalogList } from "@/components/organisms/ldc-admin-catalog-list";
import { LDCResourceRowActions } from "@/components/organisms/ldc-resource-row-actions";
import {
  LDCResourceTable,
  type LDCResourceTableColumn,
} from "@/components/organisms/ldc-resource-table";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminRegion } from "@/interfaces/admin-catalog";
import {
  CATALOG_PAGE_SIZE,
  normalizeSearch,
  paginateCatalog,
  parseCatalogParams,
} from "@/lib/dashboard/admin-catalog";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { adminRegionsService } from "@/services/admin/regions";
import { deleteRegionAction } from "./actions";

export const metadata = {
  title: "Regiones — Panel",
};

const BASE = "/dashboard/admin/regiones";

const citiesText = (r: IAdminRegion) =>
  `${r.cities.length} ${r.cities.length === 1 ? "ciudad" : "ciudades"}`;

/** Menú `⋯` de la fila: con ciudades, el diálogo avisa que no se puede eliminar. */
function rowActions(r: IAdminRegion) {
  return {
    editHref: `${BASE}/${r.id}/editar`,
    onDelete: deleteRegionAction.bind(null, r.id),
    deleteLabel: `¿Eliminar ${r.name}?`,
    deleteDescription:
      r.cities.length > 0
        ? `Tiene ${citiesText(r)}: muévelas a otra región antes de eliminarla, o no se podrá eliminar.`
        : "Esta acción no se puede deshacer.",
  };
}

const columns: LDCResourceTableColumn<IAdminRegion>[] = [
  { key: "name", header: "Nombre", cellClassName: "font-medium", cell: (r) => r.name },
  { key: "roman", header: "N.º", cellClassName: "font-mono text-xs", cell: (r) => r.romanNumeral },
  {
    key: "slug",
    header: "Slug",
    headClassName: "hidden lg:table-cell",
    cellClassName: "hidden font-mono text-xs text-muted-foreground lg:table-cell",
    cell: (r) => r.slug,
  },
  {
    key: "cities",
    header: "Ciudades",
    cellClassName: "whitespace-nowrap text-muted-foreground",
    cell: (r) => r.cities.length,
  },
];

const renderCard = (r: IAdminRegion) => (
  <LDCDashboardListItem
    title={r.name}
    subtitle={`Región ${r.romanNumeral} · ${citiesText(r)} · ${r.slug}`}
    actions={<LDCResourceRowActions {...rowActions(r)} triggerClassName="size-11 md:size-8" />}
  />
);

interface AdminRegionesPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/** «Regiones» del admin (CLGDC-126): listado con búsqueda y paginación en la URL, alta, edición y baja. */
export default async function AdminRegionesPage({ searchParams }: AdminRegionesPageProps) {
  const filters = parseCatalogParams(await searchParams);
  const regions = await adminRegionsService.list();
  const needle = normalizeSearch(filters.q);
  const matches = needle
    ? regions.filter((r) => normalizeSearch(`${r.name} ${r.slug} ${r.romanNumeral}`).includes(needle))
    : regions;
  const { items, total, page } = paginateCatalog(matches, filters.page);

  const table = (rows: IAdminRegion[], loading = false) => (
    <LDCResourceTable
      rows={rows}
      loading={loading}
      loadingLabel="Cargando regiones"
      caption="Listado de regiones"
      getRowKey={(r) => r.id}
      columns={columns}
      getRowActions={rowActions}
      renderCard={renderCard}
    />
  );

  return (
    <LDCDashboardPageTemplate
      title="Regiones"
      description="Regiones del catálogo y sus ciudades."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCAdminCatalogList
        label="Listado de regiones"
        noun={{ one: "región", many: "regiones" }}
        q={filters.q}
        searchLabel="Buscar región"
        total={total}
        page={page}
        pageSize={CATALOG_PAGE_SIZE}
        skeleton={table([], true)}
        emptyIcon={<Map className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay regiones"
        emptyDescription="Crea la primera con «Nueva»."
      >
        {table(items)}
      </LDCAdminCatalogList>
    </LDCDashboardPageTemplate>
  );
}
