import { CalendarDays, CirclePlus, Copy, ExternalLink, Pencil } from "lucide-react";
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
import type { IMyEvent } from "@/interfaces/event";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { formatEventPrice, formatEventWhen } from "@/lib/format/events";
import { getMyEvents } from "@/services/me/events";
import { archiveMyPublicationAction, unarchiveMyPublicationAction } from "../archive-actions";

export const metadata = {
  title: "Mis eventos — Panel",
};

const BASE = "/dashboard/eventos";
const NEW_HREF = `${BASE}/nuevo`;
const editHref = (id: string) => `${BASE}/${encodeURIComponent(id)}`;

/** Un evento que ya terminó es «Terminado» (el backend lo informa como EXPIRED). */
const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicado",
  review: "En revisión",
  expired: "Terminado",
  rejected: "Rechazado",
  archived: "Archivado",
};

/** Orden por urgencia: lo que pide acción primero; dentro de cada estado, por fecha. */
const URGENCY: Record<IDashboardPublicationStatus, number> = {
  rejected: 0,
  review: 1,
  published: 2,
  archived: 3,
  expired: 4,
};

/** Filtros de `?estado=`, en orden; `todos` no filtra (los terminados van al final). */
const FILTERS = [
  { key: "todos", label: "Todos", status: null },
  { key: "publicados", label: "Publicados", status: "published" },
  { key: "revision", label: "En revisión", status: "review" },
  { key: "rechazados", label: "Rechazados", status: "rejected" },
  { key: "terminados", label: "Terminados", status: "expired" },
  { key: "archivados", label: "Archivados", status: "archived" },
] as const satisfies readonly { key: string; label: string; status: IDashboardPublicationStatus | null }[];

const EMPTY: Record<(typeof FILTERS)[number]["key"], string> = {
  todos: "Cuando publiques uno, lo verás aquí con su fecha y su estado. Lo revisamos antes de mostrarlo en La Guía.",
  publicados: "No tienes eventos publicados ahora.",
  revision: "No tienes eventos esperando revisión.",
  rechazados: "No tienes eventos rechazados.",
  terminados: "No tienes eventos terminados.",
  archivados: "No tienes eventos archivados.",
};

const byStart = (a: IMyEvent, b: IMyEvent) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

interface EventosPageProps {
  searchParams: Promise<{ estado?: string | string[] }>;
}

/** Una fila: fecha primero (es lo que el organizador busca), estado y las acciones de ese estado. */
function EventRow({ event }: { event: IMyEvent }) {
  const { status, rejectionReason } = event;
  return (
    <LDCDashboardListItem
      image={event.image}
      title={event.title}
      clampTitle
      meta={
        <>
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <CalendarDays className="size-3.5" aria-hidden />
            <time dateTime={event.startsAt}>{formatEventWhen(event.startsAt, event.endsAt)}</time>
          </span>
          {status === "rejected" && rejectionReason ? (
            <LDCRejectionReasonDialog title={event.title} reason={rejectionReason} fixHref={editHref(event.id)} />
          ) : (
            <LDCBadge variant={`status-${status}`}>{STATUS_LABELS[status]}</LDCBadge>
          )}
        </>
      }
      subtitle={[event.venueName, event.city.name, formatEventPrice(event.priceType, event.priceAmount)].join(" · ")}
      actions={
        <>
          {status === "expired" ? (
            <LDCButton href={`${NEW_HREF}?desde=${encodeURIComponent(event.id)}`} variant="outline" size="sm">
              <Copy />
              Duplicar
            </LDCButton>
          ) : status === "rejected" ? (
            <LDCButton href={editHref(event.id)} size="sm">
              <Pencil />
              Corregir y reenviar
            </LDCButton>
          ) : (
            <LDCButton href={editHref(event.id)} variant="outline" size="sm">
              <Pencil />
              Editar
            </LDCButton>
          )}
          {status === "published" && (
            <LDCButton href={`/evento/${event.slug}`} variant="ghost" size="sm">
              <ExternalLink />
              Ver en La Guía
            </LDCButton>
          )}
          <LDCArchiveButton
            kind="event"
            id={event.id}
            slug={event.slug}
            title={event.title}
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
 * «Mis eventos» (CLGDC-140, lienzo de CLGDC-137): calca «Mis avisos». Los eventos de la cuenta
 * (`GET /me/events`) ordenados por urgencia y, dentro de cada estado, por fecha; pills de filtro
 * por estado (`?estado=`). En «Todos», los terminados van al final bajo «Ya terminaron», del más
 * reciente al más antiguo, con «Duplicar» (abre el formulario nuevo con todo menos las fechas) en
 * vez de «Editar». El motivo de un rechazo se abre desde su badge. «Archivar» es el «borrar» del
 * dueño (CLGDC-157).
 */
export default async function EventosPage({ searchParams }: EventosPageProps) {
  const [, { estado }, events] = await Promise.all([
    requireDashboardRole("organizador"),
    searchParams,
    getMyEvents(),
  ]);
  const raw = Array.isArray(estado) ? estado[0] : estado;
  const filter = FILTERS.find((f) => f.key === raw) ?? FILTERS[0];

  const current = events
    .filter((e) => e.status !== "expired")
    .sort((a, b) => URGENCY[a.status] - URGENCY[b.status] || byStart(a, b));
  const past = events.filter((e) => e.status === "expired").sort((a, b) => byStart(b, a));
  const visible = filter.status ? [...current, ...past].filter((e) => e.status === filter.status) : current;
  const showPast = filter.key === "todos" && past.length > 0;

  return (
    <LDCDashboardPageTemplate
      title="Mis eventos"
      description="Tus ferias, conciertos y talleres, con su fecha y su estado."
      actions={<LDCCTAButton href={NEW_HREF} text="Publicar evento" />}
    >
      <LDCStatusFilter
        current={filter.key}
        items={FILTERS.map((f) => ({
          key: f.key,
          label: f.label,
          count: f.status ? events.filter((e) => e.status === f.status).length : events.length,
          href: f.key === "todos" ? BASE : `${BASE}?estado=${f.key}`,
        }))}
      />

      <LDCPanel className="p-4">
        {visible.length === 0 && !showPast ? (
          <LDCEmptyState
            className="py-8"
            icon={<CalendarDays className="size-8 text-muted-foreground" aria-hidden />}
            title={filter.key === "todos" ? "Aún no publicas eventos" : "Nada por aquí"}
            description={EMPTY[filter.key]}
            action={
              filter.key === "todos" ? (
                <LDCButton href={NEW_HREF} className="mt-6">
                  <CirclePlus />
                  Publicar evento
                </LDCButton>
              ) : undefined
            }
          />
        ) : (
          <>
            {visible.length > 0 && (
              <ul>
                {visible.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
            )}
            {showPast && (
              <>
                <h2
                  id="ldc-eventos-terminados"
                  className="mb-1 mt-6 border-t border-border pt-4 font-open-sans text-xs font-bold uppercase tracking-wide text-muted-foreground first:mt-0 first:border-t-0 first:pt-0"
                >
                  Ya terminaron
                </h2>
                <ul aria-labelledby="ldc-eventos-terminados" className="[&>li]:opacity-90">
                  {past.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
