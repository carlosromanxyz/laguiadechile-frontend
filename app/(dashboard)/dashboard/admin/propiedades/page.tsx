import { House, Plus, Star } from "lucide-react";
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
import type { IAdminProperty } from "@/interfaces/admin-catalog";
import {
  CATALOG_PAGE_SIZE,
  normalizeSearch,
  paginateCatalog,
  parseCatalogParams,
} from "@/lib/dashboard/admin-catalog";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { formatPropertyPriceWithPeriod } from "@/lib/format/properties";
import { adminCitiesService } from "@/services/admin/cities";
import { adminPropertiesService } from "@/services/admin/properties";
import {
  PROPERTY_OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/validations/admin-catalog-schema";
import { deletePropertyAction } from "./actions";

export const metadata = {
  title: "Propiedades — Panel",
};

const BASE = "/dashboard/admin/propiedades";

/** Máximo de `GET /properties?limit=`. */
const PROPERTIES_LIMIT = 200;

const metaText = (p: IAdminProperty) =>
  [PROPERTY_TYPE_LABELS[p.type], PROPERTY_OPERATION_LABELS[p.operation], p.city.name].join(" · ");

const priceText = (p: IAdminProperty) =>
  formatPropertyPriceWithPeriod({
    amount: p.priceAmount,
    currency: p.priceCurrency === "UF" ? "uf" : "clp",
    period: (p.pricePeriod ?? undefined) as "mes" | "dia" | "semana" | undefined,
  });

function rowActions(p: IAdminProperty) {
  return {
    editHref: `${BASE}/${p.id}`,
    onDelete: deletePropertyAction.bind(null, p.id),
    deleteLabel: "¿Eliminar esta propiedad?",
    deleteDescription: `«${p.title}» deja de verse en el sitio. Esta acción no se puede deshacer.`,
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

const columns: LDCResourceTableColumn<IAdminProperty>[] = [
  {
    key: "title",
    header: "Propiedad",
    cellClassName: "w-full max-w-0",
    cell: (p) => (
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={p.image}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-md bg-muted object-cover"
        />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/propiedad/${p.slug}`}
              title={p.title}
              className="truncate font-bold hover:underline focus-visible:underline"
            >
              {p.title}
            </Link>
            {p.featured && <FeaturedBadge />}
          </div>
          <p className="truncate font-open-sans text-xs text-muted-foreground">{metaText(p)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "Precio",
    cellClassName: "whitespace-nowrap",
    cell: (p) => priceText(p),
  },
];

const renderCard = (p: IAdminProperty) => (
  <LDCDashboardListItem
    image={p.image}
    title={p.title}
    clampTitle
    meta={p.featured ? <FeaturedBadge /> : undefined}
    subtitle={`${metaText(p)} · ${priceText(p)}`}
    actions={<LDCResourceRowActions {...rowActions(p)} triggerClassName="size-11 md:size-8" />}
  />
);

interface AdminPropiedadesPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Propiedades» del admin (CLGDC-126): listado con búsqueda, ciudad y paginación en la URL; el
 * formulario va en página propia.
 */
export default async function AdminPropiedadesPage({ searchParams }: AdminPropiedadesPageProps) {
  const filters = parseCatalogParams(await searchParams);
  const [properties, allCities] = await Promise.all([
    adminPropertiesService.list({ limit: PROPERTIES_LIMIT }),
    adminCitiesService.list({ limit: 500 }),
  ]);
  const cities = allCities
    .map(({ id, name, slug }) => ({ id, name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const city = cities.some((c) => c.slug === filters.city) ? filters.city : "";
  const needle = normalizeSearch(filters.q);
  const matches = properties.filter(
    (p) =>
      (!city || p.city.slug === city) &&
      (!needle || normalizeSearch(`${p.title} ${p.location} ${p.commune ?? ""}`).includes(needle)),
  );
  const { items, total, page } = paginateCatalog(matches, filters.page);

  const table = (rows: IAdminProperty[], loading = false) => (
    <LDCResourceTable
      rows={rows}
      loading={loading}
      loadingLabel="Cargando propiedades"
      caption="Listado de propiedades: primero las destacadas, luego de la más nueva a la más antigua"
      getRowKey={(p) => p.id}
      columns={columns}
      getRowActions={rowActions}
      renderCard={renderCard}
      isRowHighlighted={(p) => p.featured}
    />
  );

  return (
    <LDCDashboardPageTemplate
      title="Propiedades"
      description="Propiedades en venta y arriendo publicadas en el sitio."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCAdminCatalogList
        label="Listado de propiedades"
        noun={{ one: "propiedad", many: "propiedades" }}
        q={filters.q}
        searchLabel="Buscar por título o ubicación"
        city={city}
        cities={cities}
        total={total}
        page={page}
        pageSize={CATALOG_PAGE_SIZE}
        skeleton={table([], true)}
        emptyIcon={<House className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay propiedades"
        emptyDescription="Crea la primera con «Nueva»."
      >
        {table(items)}
      </LDCAdminCatalogList>
    </LDCDashboardPageTemplate>
  );
}
