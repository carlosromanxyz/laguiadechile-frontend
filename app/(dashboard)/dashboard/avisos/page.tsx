import { ExternalLink, Pencil, RefreshCw, Tags } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCRejectionReasonDialog } from "@/components/molecules/ldc-rejection-reason-dialog";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import { formatShortDate } from "@/lib/dashboard/dates";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { formatClassifiedPrice, typeLabels } from "@/lib/format/classifieds";
import { getMyClassifieds } from "@/services/dashboard/usuario";

export const metadata = {
  title: "Mis avisos — Panel",
};

const BASE = "/dashboard/avisos";
// Formularios de aviso (nuevo y edición): CLGDC-125.
const NEW_HREF = `${BASE}/nuevo`;
const editHref = (id: string) => `${BASE}/${encodeURIComponent(id)}`;

const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicado",
  review: "En revisión",
  expired: "Vencido",
  rejected: "Rechazado",
};

/** Orden por urgencia: lo que pide acción primero. */
const URGENCY: Record<IDashboardPublicationStatus, number> = {
  rejected: 0,
  expired: 1,
  review: 2,
  published: 3,
};

/** Filtros de `?estado=`, en orden; `todos` no filtra. */
const FILTERS = [
  { key: "todos", label: "Todos", status: null },
  { key: "publicados", label: "Publicados", status: "published" },
  { key: "revision", label: "En revisión", status: "review" },
  { key: "rechazados", label: "Rechazados", status: "rejected" },
  { key: "vencidos", label: "Vencidos", status: "expired" },
] as const satisfies readonly { key: string; label: string; status: IDashboardPublicationStatus | null }[];

const EMPTY: Record<(typeof FILTERS)[number]["key"], string> = {
  todos: "Cuando publiques un aviso, lo verás aquí con su estado y vencimiento.",
  publicados: "No tienes avisos publicados ahora.",
  revision: "No tienes avisos esperando revisión.",
  rechazados: "No tienes avisos rechazados.",
  vencidos: "No tienes avisos vencidos.",
};

interface AvisosPageProps {
  searchParams: Promise<{ estado?: string | string[] }>;
}

/**
 * «Mis avisos» (diseño C1 de CLGDC-113): los avisos de la cuenta (`GET /me/classifieds`) ordenados
 * por urgencia, con pills de filtro por estado (`?estado=`) y las acciones de cada estado. El
 * motivo de un rechazo se abre desde su badge, en un modal. Los formularios de aviso son de
 * CLGDC-125: «Editar», «Renovar» y «Corregir y reenviar» apuntan a `/dashboard/avisos/[id]`.
 */
export default async function AvisosPage({ searchParams }: AvisosPageProps) {
  const [, { estado }, classifieds] = await Promise.all([
    requireDashboardRole("avisador"),
    searchParams,
    getMyClassifieds(),
  ]);
  const raw = Array.isArray(estado) ? estado[0] : estado;
  const filter = FILTERS.find((f) => f.key === raw) ?? FILTERS[0];

  const sorted = [...classifieds].sort(
    (a, b) => URGENCY[a.ownership.status] - URGENCY[b.ownership.status],
  );
  const visible = filter.status ? sorted.filter((c) => c.ownership.status === filter.status) : sorted;

  return (
    <LDCDashboardPageTemplate
      title="Mis avisos"
      description="Cada aviso dura 30 días. Renuévalo cuando venza."
      actions={<LDCCTAButton href={NEW_HREF} text="Publicar aviso" />}
    >
      <LDCStatusFilter
        current={filter.key}
        items={FILTERS.map((f) => ({
          key: f.key,
          label: f.label,
          count: f.status ? classifieds.filter((c) => c.ownership.status === f.status).length : classifieds.length,
          href: f.key === "todos" ? BASE : `${BASE}?estado=${f.key}`,
        }))}
      />

      <LDCPanel className="p-4">
        {visible.length === 0 ? (
          <LDCEmptyState
            className="py-8"
            icon={<Tags className="size-8 text-muted-foreground" aria-hidden />}
            title={filter.key === "todos" ? "Aún no publicas avisos" : "Nada por aquí"}
            description={EMPTY[filter.key]}
          />
        ) : (
          <ul>
            {visible.map(({ item, ownership }) => {
              const { status, rejectionReason } = ownership;
              const date =
                status === "published"
                  ? `vence el ${formatShortDate(item.expiresAt)}`
                  : status === "expired"
                    ? `venció el ${formatShortDate(item.expiresAt)}`
                    : status === "rejected"
                      ? "no publicado"
                      : null;
              return (
                <LDCDashboardListItem
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  meta={
                    <>
                      <LDCBadge variant={`classified-${item.type}`}>{typeLabels[item.type]}</LDCBadge>
                      {status === "rejected" && rejectionReason ? (
                        <LDCRejectionReasonDialog
                          title={item.title}
                          reason={rejectionReason}
                          fixHref={editHref(item.id)}
                        />
                      ) : (
                        <LDCBadge variant={`status-${status}`}>{STATUS_LABELS[status]}</LDCBadge>
                      )}
                    </>
                  }
                  subtitle={[
                    formatClassifiedPrice(item.price),
                    [item.commune, item.city.name].filter(Boolean).join(", "),
                    date,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  actions={
                    <>
                      {status === "expired" && (
                        <LDCButton href={editHref(item.id)} size="sm">
                          <RefreshCw />
                          Renovar
                        </LDCButton>
                      )}
                      {status === "rejected" ? (
                        <LDCButton href={editHref(item.id)} size="sm">
                          <Pencil />
                          Corregir y reenviar
                        </LDCButton>
                      ) : (
                        <LDCButton href={editHref(item.id)} variant="outline" size="sm">
                          <Pencil />
                          Editar
                        </LDCButton>
                      )}
                      {status === "published" && (
                        <LDCButton href={`/aviso/${item.slug}`} variant="ghost" size="sm">
                          <ExternalLink />
                          Ver en La Guía
                        </LDCButton>
                      )}
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
