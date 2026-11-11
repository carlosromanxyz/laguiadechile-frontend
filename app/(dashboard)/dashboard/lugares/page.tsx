import { CirclePlus, ExternalLink, MapPin, Pencil } from "lucide-react";
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
import type { IMyPlace } from "@/interfaces/place";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { PLACE_TYPE_META } from "@/lib/format/places";
import { getMyPlaces } from "@/services/me/places";
import { archiveMyPublicationAction, unarchiveMyPublicationAction } from "../archive-actions";

export const metadata = {
  title: "Mis lugares — Panel",
};

const BASE = "/dashboard/lugares";
const NEW_HREF = `${BASE}/nuevo`;
const editHref = (id: string) => `${BASE}/${encodeURIComponent(id)}`;

/** Los lugares no vencen: `expired` no llega, pero el tipo lo pide. */
const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicado",
  review: "En revisión",
  expired: "Vencido",
  rejected: "Rechazado",
  archived: "Archivado",
};

/** Orden por urgencia: lo que pide acción primero; dentro de cada estado, el último editado arriba. */
const URGENCY: Record<IDashboardPublicationStatus, number> = {
  rejected: 0,
  review: 1,
  published: 2,
  expired: 3,
  archived: 4,
};

/** Filtros de `?estado=`, en orden; `todos` no filtra. Sin «Vencidos»: los lugares no vencen. */
const FILTERS = [
  { key: "todos", label: "Todos", status: null },
  { key: "publicados", label: "Publicados", status: "published" },
  { key: "revision", label: "En revisión", status: "review" },
  { key: "rechazados", label: "Rechazados", status: "rejected" },
  { key: "archivados", label: "Archivados", status: "archived" },
] as const satisfies readonly { key: string; label: string; status: IDashboardPublicationStatus | null }[];

const EMPTY: Record<(typeof FILTERS)[number]["key"], string> = {
  todos: "Cuando publiques uno, lo verás aquí con su estado. Lo revisamos antes de mostrarlo en La Guía.",
  publicados: "No tienes lugares publicados ahora.",
  revision: "No tienes lugares esperando revisión.",
  rechazados: "No tienes lugares rechazados.",
  archivados: "No tienes lugares archivados.",
};

interface LugaresPageProps {
  searchParams: Promise<{ estado?: string | string[] }>;
}

/** Una fila: tipo y ciudad, estado y las acciones de ese estado. */
function PlaceRow({ place }: { place: IMyPlace }) {
  const { status, rejectionReason } = place;
  return (
    <LDCDashboardListItem
      image={place.image}
      title={place.title}
      clampTitle
      meta={
        status === "rejected" && rejectionReason ? (
          <LDCRejectionReasonDialog title={place.title} reason={rejectionReason} fixHref={editHref(place.id)} />
        ) : (
          <LDCBadge variant={`status-${status}`}>{STATUS_LABELS[status]}</LDCBadge>
        )
      }
      subtitle={[PLACE_TYPE_META[place.type].label, place.address, place.city.name].join(" · ")}
      actions={
        <>
          {status === "rejected" ? (
            <LDCButton href={editHref(place.id)} size="sm">
              <Pencil />
              Corregir y reenviar
            </LDCButton>
          ) : (
            <LDCButton href={editHref(place.id)} variant="outline" size="sm">
              <Pencil />
              Editar
            </LDCButton>
          )}
          {status === "published" && (
            <LDCButton href={`/lugar/${place.slug}`} variant="ghost" size="sm">
              <ExternalLink />
              Ver en La Guía
            </LDCButton>
          )}
          <LDCArchiveButton
            kind="place"
            id={place.id}
            slug={place.slug}
            title={place.title}
            archived={status === "archived"}
            onArchive={archiveMyPublicationAction}
            onUnarchive={unarchiveMyPublicationAction}
          />
        </>
      }
    />
  );
}

/**
 * «Mis lugares» (CLGDC-209): calca «Mis eventos». Los lugares de la cuenta (`GET /me/places`)
 * ordenados por urgencia, con pills de filtro por estado (`?estado=`). El motivo de un rechazo se
 * abre desde su badge; «Archivar» es el «borrar» del dueño (CLGDC-157).
 */
export default async function LugaresPage({ searchParams }: LugaresPageProps) {
  const [, { estado }, places] = await Promise.all([
    requireDashboardRole("colaborador"),
    searchParams,
    getMyPlaces(),
  ]);
  const raw = Array.isArray(estado) ? estado[0] : estado;
  const filter = FILTERS.find((f) => f.key === raw) ?? FILTERS[0];

  const sorted = [...places].sort(
    (a, b) =>
      URGENCY[a.status] - URGENCY[b.status] || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const visible = filter.status ? sorted.filter((p) => p.status === filter.status) : sorted;

  return (
    <LDCDashboardPageTemplate
      title="Mis lugares"
      description="Los atractivos, ferias y servicios públicos que sumaste a La Guía, con su estado."
      actions={<LDCCTAButton href={NEW_HREF} text="Publicar lugar" />}
    >
      <LDCStatusFilter
        current={filter.key}
        items={FILTERS.map((f) => ({
          key: f.key,
          label: f.label,
          count: f.status ? places.filter((p) => p.status === f.status).length : places.length,
          href: f.key === "todos" ? BASE : `${BASE}?estado=${f.key}`,
        }))}
      />

      <LDCPanel className="p-4">
        {visible.length === 0 ? (
          <LDCEmptyState
            className="py-8"
            icon={<MapPin className="size-8 text-muted-foreground" aria-hidden />}
            title={filter.key === "todos" ? "Aún no publicas lugares" : "Nada por aquí"}
            description={EMPTY[filter.key]}
            action={
              filter.key === "todos" ? (
                <LDCButton href={NEW_HREF} className="mt-6">
                  <CirclePlus />
                  Publicar lugar
                </LDCButton>
              ) : undefined
            }
          />
        ) : (
          <ul>
            {visible.map((place) => (
              <PlaceRow key={place.id} place={place} />
            ))}
          </ul>
        )}
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
