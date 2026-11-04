import { ExternalLink, Pencil, Store } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCArchiveButton } from "@/components/molecules/ldc-archive-button";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCRejectionReasonDialog } from "@/components/molecules/ldc-rejection-reason-dialog";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyListings } from "@/services/dashboard/comercio";
import { archiveMyPublicationAction, unarchiveMyPublicationAction } from "../../archive-actions";

export const metadata = {
  title: "Mis fichas — Panel",
};

const BASE = "/dashboard/comercio/publicaciones";

type ListingType = IListingDetail["type"];

const TYPE_LABELS: Record<ListingType, string> = { comercio: "Comercio", servicio: "Servicio" };

const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicada",
  review: "En revisión",
  expired: "Vencida",
  rejected: "Rechazada",
  archived: "Archivada",
};

/** Orden por urgencia: lo que pide acción primero. */
const URGENCY: Record<IDashboardPublicationStatus, number> = {
  rejected: 0,
  expired: 1,
  review: 2,
  published: 3,
  archived: 4,
};

/** Filtros de `?estado=`, en orden; `todas` no filtra. Las fichas no vencen: no hay «Vencidas». */
const FILTERS = [
  { key: "todas", label: "Todas", status: null },
  { key: "publicadas", label: "Publicadas", status: "published" },
  { key: "revision", label: "En revisión", status: "review" },
  { key: "rechazadas", label: "Rechazadas", status: "rejected" },
  { key: "archivadas", label: "Archivadas", status: "archived" },
] as const satisfies readonly { key: string; label: string; status: IDashboardPublicationStatus | null }[];

const EMPTY: Record<(typeof FILTERS)[number]["key"], string> = {
  todas: "Cuando publiques una ficha, la verás aquí con su estado.",
  publicadas: "No tienes fichas publicadas ahora.",
  revision: "No tienes fichas esperando revisión.",
  rechazadas: "No tienes fichas rechazadas.",
  archivadas: "No tienes fichas archivadas.",
};

const DESCRIPTIONS: Record<ListingType | "todas", string> = {
  comercio: "Tus comercios y su estado. Revisamos cada cambio antes de publicarlo.",
  servicio: "Tus servicios y su estado. Revisamos cada cambio antes de publicarlo.",
  todas: "Tus fichas y su estado. Revisamos cada cambio antes de publicarlo.",
};

const numberFormat = new Intl.NumberFormat("es-CL");

const editHref = (l: IListingDetail) =>
  `/dashboard/comercio/ficha?id=${encodeURIComponent(l.id)}&tipo=${l.type}`;

interface PublicacionesPageProps {
  searchParams: Promise<{ tipo?: string | string[]; estado?: string | string[] }>;
}

/**
 * «Mis fichas» de «Mis comercios» y «Mis servicios»: la página de «Mis propiedades» para las
 * fichas de la cuenta (`GET /me/listings`), ordenadas por urgencia, con pills de filtro por estado
 * (`?estado=`). `?tipo=comercio|servicio` (el grupo del menú) deja solo las fichas de ese tipo; sin
 * él, se ven todas. El motivo de un rechazo se abre desde su badge, en un modal; «Editar» lleva a
 * la ficha elegida y «Archivar»/«Desarchivar» son los de CLGDC-159.
 */
export default async function ComercioPublicacionesPage({ searchParams }: PublicacionesPageProps) {
  const [, { tipo, estado }, all] = await Promise.all([
    requireDashboardRole(["comercio", "servicio"]),
    searchParams,
    getMyListings(),
  ]);
  const rawTipo = Array.isArray(tipo) ? tipo[0] : tipo;
  const type: ListingType | undefined =
    rawTipo === "comercio" || rawTipo === "servicio" ? rawTipo : undefined;
  const rawEstado = Array.isArray(estado) ? estado[0] : estado;
  const filter = FILTERS.find((f) => f.key === rawEstado) ?? FILTERS[0];

  const listings = type ? all.filter((l) => l.item.type === type) : all;
  const sorted = [...listings].sort((a, b) => URGENCY[a.ownership.status] - URGENCY[b.ownership.status]);
  const visible = filter.status ? sorted.filter((l) => l.ownership.status === filter.status) : sorted;
  const mixedTypes = !type && new Set(all.map((l) => l.item.type)).size > 1;

  const filterHref = (key: string) => {
    const qs = new URLSearchParams();
    if (type) qs.set("tipo", type);
    if (key !== "todas") qs.set("estado", key);
    const q = qs.toString();
    return q ? `${BASE}?${q}` : BASE;
  };
  const publishHref = type === "servicio" ? "/dashboard/publicar?tipo=servicio" : "/dashboard/publicar";

  return (
    <LDCDashboardPageTemplate
      title="Mis fichas"
      description={DESCRIPTIONS[type ?? "todas"]}
      actions={<LDCCTAButton href={publishHref} text="Publicar otra ficha" />}
    >
      <LDCStatusFilter
        current={filter.key}
        items={FILTERS.map((f) => ({
          key: f.key,
          label: f.label,
          count: f.status ? listings.filter((l) => l.ownership.status === f.status).length : listings.length,
          href: filterHref(f.key),
        }))}
      />

      <LDCPanel className="p-4">
        {visible.length === 0 ? (
          <LDCEmptyState
            className="py-8"
            icon={<Store className="size-8 text-muted-foreground" aria-hidden />}
            title={filter.key === "todas" ? "Aún no tienes fichas" : "Nada por aquí"}
            description={EMPTY[filter.key]}
            action={
              filter.key === "todas" ? (
                <LDCCTAButton href={publishHref} text="Publicar ficha" showIcon={false} className="mt-6" />
              ) : undefined
            }
          />
        ) : (
          <ul>
            {visible.map(({ item, ownership }) => {
              const { status, rejectionReason, visits30d } = ownership;
              return (
                <LDCDashboardListItem
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  meta={
                    <>
                      {status === "rejected" && rejectionReason ? (
                        <LDCRejectionReasonDialog
                          title={item.title}
                          reason={rejectionReason}
                          fixHref={editHref(item)}
                          badgeLabel={STATUS_LABELS.rejected}
                        />
                      ) : (
                        <LDCBadge variant={`status-${status}`}>{STATUS_LABELS[status]}</LDCBadge>
                      )}
                      {item.featured && status === "published" && (
                        <LDCBadge variant="featured">Destacado</LDCBadge>
                      )}
                      {mixedTypes && (
                        <span className="font-open-sans text-xs text-muted-foreground">
                          {TYPE_LABELS[item.type]}
                        </span>
                      )}
                    </>
                  }
                  subtitle={[
                    item.category.name,
                    item.city.name,
                    status === "published" && visits30d != null
                      ? `${numberFormat.format(visits30d)} ${visits30d === 1 ? "visita" : "visitas"} en 30 días`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  actions={
                    <>
                      {status === "rejected" ? (
                        <LDCButton href={editHref(item)} size="sm">
                          <Pencil />
                          Corregir y reenviar
                        </LDCButton>
                      ) : (
                        <LDCButton href={editHref(item)} variant="outline" size="sm">
                          <Pencil />
                          Editar
                        </LDCButton>
                      )}
                      {status === "published" && (
                        <LDCButton href={`/${item.type}/${item.slug}`} variant="ghost" size="sm">
                          <ExternalLink />
                          Ver en La Guía
                        </LDCButton>
                      )}
                      <LDCArchiveButton
                        kind="listing"
                        id={item.id}
                        slug={item.slug}
                        title={item.title}
                        archived={status === "archived"}
                        onArchive={archiveMyPublicationAction}
                        onUnarchive={unarchiveMyPublicationAction}
                      />
                    </>
                  }
                />
              );
            })}
          </ul>
        )}
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
