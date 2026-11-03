import { Newspaper, Plus, Star } from "lucide-react";
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
import type { IAdminNews } from "@/interfaces/admin-catalog";
import {
  CATALOG_PAGE_SIZE,
  normalizeSearch,
  paginateCatalog,
  parseCatalogParams,
} from "@/lib/dashboard/admin-catalog";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { formatShortDate } from "@/lib/dashboard/dates";
import { adminNewsService } from "@/services/admin/news";
import { deleteNewsAction } from "./actions";

export const metadata = {
  title: "Noticias — Panel",
};

const BASE = "/dashboard/admin/noticias";

/** Máximo de `GET /news?limit=`. */
const NEWS_LIMIT = 200;

const metaText = (n: IAdminNews) => [n.category?.name ?? "Sin categoría", n.authorName].join(" · ");

function rowActions(n: IAdminNews) {
  return {
    editHref: `${BASE}/${n.id}`,
    onDelete: deleteNewsAction.bind(null, n.id),
    deleteLabel: "¿Eliminar esta noticia?",
    deleteDescription: `«${n.title}» deja de verse en el sitio. Esta acción no se puede deshacer.`,
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

const columns: LDCResourceTableColumn<IAdminNews>[] = [
  {
    key: "title",
    header: "Noticia",
    cellClassName: "w-full max-w-0",
    cell: (n) => (
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={n.image}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-md bg-muted object-cover"
        />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/noticia/${n.slug}`}
              title={n.title}
              className="truncate font-bold hover:underline focus-visible:underline"
            >
              {n.title}
            </Link>
            {n.featured && <FeaturedBadge />}
          </div>
          <p className="truncate font-open-sans text-xs text-muted-foreground">{metaText(n)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "publishedAt",
    header: "Publicada",
    cellClassName: "whitespace-nowrap text-muted-foreground",
    cell: (n) => <time dateTime={n.publishedAt}>{formatShortDate(n.publishedAt)}</time>,
  },
];

const renderCard = (n: IAdminNews) => (
  <LDCDashboardListItem
    image={n.image}
    title={n.title}
    clampTitle
    meta={n.featured ? <FeaturedBadge /> : undefined}
    subtitle={`${metaText(n)} · ${formatShortDate(n.publishedAt)}`}
    actions={<LDCResourceRowActions {...rowActions(n)} triggerClassName="size-11 md:size-8" />}
  />
);

interface AdminNoticiasPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/** «Noticias» del admin (CLGDC-126): listado con búsqueda y paginación; el formulario va en página propia. */
export default async function AdminNoticiasPage({ searchParams }: AdminNoticiasPageProps) {
  const filters = parseCatalogParams(await searchParams);
  const news = await adminNewsService.list({ limit: NEWS_LIMIT });
  const needle = normalizeSearch(filters.q);
  const matches = needle
    ? news.filter((n) => normalizeSearch(`${n.title} ${n.authorName} ${n.category?.name ?? ""}`).includes(needle))
    : news;
  const { items, total, page } = paginateCatalog(matches, filters.page);

  const table = (rows: IAdminNews[], loading = false) => (
    <LDCResourceTable
      rows={rows}
      loading={loading}
      loadingLabel="Cargando noticias"
      caption="Listado de noticias: primero las destacadas, luego de la más reciente a la más antigua"
      getRowKey={(n) => n.id}
      columns={columns}
      getRowActions={rowActions}
      renderCard={renderCard}
      isRowHighlighted={(n) => n.featured}
    />
  );

  return (
    <LDCDashboardPageTemplate
      title="Noticias"
      description="Noticias publicadas en el sitio."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCAdminCatalogList
        label="Listado de noticias"
        noun={{ one: "noticia", many: "noticias" }}
        q={filters.q}
        searchLabel="Buscar por título o autor"
        total={total}
        page={page}
        pageSize={CATALOG_PAGE_SIZE}
        skeleton={table([], true)}
        emptyIcon={<Newspaper className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay noticias"
        emptyDescription="Crea la primera con «Nueva»."
      >
        {table(items)}
      </LDCAdminCatalogList>
    </LDCDashboardPageTemplate>
  );
}
