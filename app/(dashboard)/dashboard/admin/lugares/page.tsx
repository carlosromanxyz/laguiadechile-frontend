import { MapPinned, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import type { IAdminPlace } from "@/interfaces/place";
import { ApiError } from "@/lib/api-client";
import {
  CATALOG_PAGE_SIZE,
  normalizeSearch,
  paginateCatalog,
  parseCatalogParams,
} from "@/lib/dashboard/admin-catalog";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { PLACE_TYPE_META } from "@/lib/format/places";
import { adminPlacesService } from "@/services/admin/places";
import { deletePlaceAction } from "./actions";

export const metadata = {
  title: "Lugares — Panel",
};

const BASE = "/dashboard/admin/lugares";

/** Máximo de `GET /places?limit=`. */
const PLACES_LIMIT = 200;

const metaText = (p: IAdminPlace) => [PLACE_TYPE_META[p.type].label, p.city.name].join(" · ");

function rowActions(p: IAdminPlace) {
  return {
    editHref: `${BASE}/${p.id}`,
    onDelete: deletePlaceAction.bind(null, p.id),
    deleteLabel: "¿Eliminar este lugar?",
    deleteDescription: `«${p.title}» deja de verse en el sitio. Esta acción no se puede deshacer.`,
  };
}

function FeaturedBadge() {
  return (
    <LDCBadge variant="featured-icon">
      <Star className="size-2.5 fill-current" aria-hidden />
      Destacado
    </LDCBadge>
  );
}

const columns: LDCResourceTableColumn<IAdminPlace>[] = [
  {
    key: "title",
    header: "Lugar",
    cellClassName: "w-full max-w-0",
    cell: (p) => (
      <div className="flex min-w-0 items-center gap-3">
        <Image src={p.image} alt="" width={40} height={40} className="size-10 shrink-0 rounded-md bg-muted object-cover" />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Link href={`/lugar/${p.slug}`} title={p.title} className="truncate font-bold hover:underline focus-visible:underline">
              {p.title}
            </Link>
            {p.featured && <FeaturedBadge />}
          </div>
          <p className="truncate font-open-sans text-xs text-muted-foreground">{p.address}</p>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Tipo",
    cellClassName: "whitespace-nowrap text-muted-foreground",
    cell: (p) => PLACE_TYPE_META[p.type].label,
  },
  {
    key: "city",
    header: "Ciudad",
    cellClassName: "whitespace-nowrap text-muted-foreground",
    cell: (p) => p.city.name,
  },
];

const renderCard = (p: IAdminPlace) => (
  <LDCDashboardListItem
    image={p.image}
    title={p.title}
    clampTitle
    meta={p.featured ? <FeaturedBadge /> : undefined}
    subtitle={metaText(p)}
    actions={<LDCResourceRowActions {...rowActions(p)} triggerClassName="size-11 md:size-8" />}
  />
);

/** Lista del admin; si la API aún no expone `/places` (404), vacía. */
async function listPlaces(): Promise<IAdminPlace[]> {
  try {
    return await adminPlacesService.list({ limit: PLACES_LIMIT });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return [];
    throw e;
  }
}

interface AdminLugaresPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/** «Lugares» del admin (CLGDC-207): listado con búsqueda y paginación; el formulario va en página propia. */
export default async function AdminLugaresPage({ searchParams }: AdminLugaresPageProps) {
  const filters = parseCatalogParams(await searchParams);
  const places = await listPlaces();
  const needle = normalizeSearch(filters.q);
  const matches = needle
    ? places.filter((p) =>
        normalizeSearch(`${p.title} ${p.city.name} ${PLACE_TYPE_META[p.type].label} ${p.address}`).includes(needle),
      )
    : places;
  const { items, total, page } = paginateCatalog(matches, filters.page);

  const table = (rows: IAdminPlace[], loading = false) => (
    <LDCResourceTable
      rows={rows}
      loading={loading}
      loadingLabel="Cargando lugares"
      caption="Listado de lugares: primero los destacados, luego por nombre"
      getRowKey={(p) => p.id}
      columns={columns}
      getRowActions={rowActions}
      renderCard={renderCard}
      isRowHighlighted={(p) => p.featured}
    />
  );

  return (
    <LDCDashboardPageTemplate
      title="Lugares"
      description="Atractivos, servicios públicos y ferias que se ven en el sitio."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nuevo
        </LDCButton>
      }
    >
      <LDCAdminCatalogList
        label="Listado de lugares"
        noun={{ one: "lugar", many: "lugares" }}
        q={filters.q}
        searchLabel="Buscar por nombre, tipo o ciudad"
        total={total}
        page={page}
        pageSize={CATALOG_PAGE_SIZE}
        skeleton={table([], true)}
        emptyIcon={<MapPinned className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay lugares"
        emptyDescription="Crea el primero con «Nuevo»."
      >
        {table(items)}
      </LDCAdminCatalogList>
    </LDCDashboardPageTemplate>
  );
}
