import { ExternalLink, House, Pencil } from "lucide-react";
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
import type { IMyProperty } from "@/interfaces/my-property";
import type { PropertyOperation, PropertyType } from "@/interfaces/property";
import { requireDashboardRole } from "@/lib/dashboard/session";
import {
  formatPropertyPriceWithPeriod,
  getOperationLabel,
  getPropertyRooms,
  getPropertyTypeLabel,
} from "@/lib/format/properties";
import { getMyProperties } from "@/services/me/properties";
import { archiveMyPublicationAction, unarchiveMyPublicationAction } from "../archive-actions";

export const metadata = {
  title: "Mis propiedades — Panel",
};

const BASE = "/dashboard/propiedades";
const NEW_HREF = `${BASE}/nueva`;
const editHref = (id: string) => `${BASE}/${encodeURIComponent(id)}`;

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

/** Filtros de `?estado=`, en orden; `todas` no filtra. Las propiedades no vencen: no hay «Vencidas». */
const FILTERS = [
  { key: "todas", label: "Todas", status: null },
  { key: "publicadas", label: "Publicadas", status: "published" },
  { key: "revision", label: "En revisión", status: "review" },
  { key: "rechazadas", label: "Rechazadas", status: "rejected" },
  { key: "archivadas", label: "Archivadas", status: "archived" },
] as const satisfies readonly { key: string; label: string; status: IDashboardPublicationStatus | null }[];

const EMPTY: Record<(typeof FILTERS)[number]["key"], string> = {
  todas: "Cuando publiques una propiedad, la verás aquí con su estado.",
  publicadas: "No tienes propiedades publicadas ahora.",
  revision: "No tienes propiedades esperando revisión.",
  rechazadas: "No tienes propiedades rechazadas.",
  archivadas: "No tienes propiedades archivadas.",
};

const publicType = (p: IMyProperty) => p.type.toLowerCase() as PropertyType;
const publicOperation = (p: IMyProperty) => p.operation.toLowerCase().replace("_", "-") as PropertyOperation;

/** «UF 4.800» o «$550.000/mes», con los helpers de la tarjeta pública. */
function priceText(p: IMyProperty): string {
  const period = p.pricePeriod === "mes" || p.pricePeriod === "dia" || p.pricePeriod === "semana" ? p.pricePeriod : undefined;
  return formatPropertyPriceWithPeriod({
    amount: p.priceAmount,
    currency: p.priceCurrency === "CLP" ? "clp" : "uf",
    period,
  });
}

/** «62 m² · 2 dorm.»: solo lo que aplica al tipo (`getPropertyRooms`). */
function featuresText(p: IMyProperty): string {
  const { bedrooms } = getPropertyRooms(publicType(p), { bedrooms: p.bedrooms ?? undefined });
  return [`${p.surface.toLocaleString("es-CL")} m²`, bedrooms !== undefined ? `${bedrooms} dorm.` : null]
    .filter(Boolean)
    .join(" · ");
}

interface PropiedadesPageProps {
  searchParams: Promise<{ estado?: string | string[] }>;
}

/**
 * «Mis propiedades» (CLGDC-164): la página de «Mis avisos» para las propiedades de la cuenta
 * (`GET /me/properties`), ordenadas por urgencia, con pills de filtro por estado (`?estado=`) y las
 * acciones de cada estado. El motivo de un rechazo se abre desde su badge, en un modal; «Archivar»
 * y «Desarchivar» son los de CLGDC-159.
 */
export default async function PropiedadesPage({ searchParams }: PropiedadesPageProps) {
  const [, { estado }, properties] = await Promise.all([
    requireDashboardRole("propietario"),
    searchParams,
    getMyProperties(),
  ]);
  const raw = Array.isArray(estado) ? estado[0] : estado;
  const filter = FILTERS.find((f) => f.key === raw) ?? FILTERS[0];

  const sorted = [...properties].sort((a, b) => URGENCY[a.status] - URGENCY[b.status]);
  const visible = filter.status ? sorted.filter((p) => p.status === filter.status) : sorted;

  return (
    <LDCDashboardPageTemplate
      title="Mis propiedades"
      description="Revisamos cada propiedad antes de publicarla. No vencen: archívala cuando la vendas o arriendes."
      actions={<LDCCTAButton href={NEW_HREF} text="Publicar propiedad" />}
    >
      <LDCStatusFilter
        current={filter.key}
        items={FILTERS.map((f) => ({
          key: f.key,
          label: f.label,
          count: f.status ? properties.filter((p) => p.status === f.status).length : properties.length,
          href: f.key === "todas" ? BASE : `${BASE}?estado=${f.key}`,
        }))}
      />

      <LDCPanel className="p-4">
        {visible.length === 0 ? (
          <LDCEmptyState
            className="py-8"
            icon={<House className="size-8 text-muted-foreground" aria-hidden />}
            title={filter.key === "todas" ? "Aún no publicas propiedades" : "Nada por aquí"}
            description={EMPTY[filter.key]}
          />
        ) : (
          <ul>
            {visible.map((p) => {
              const { status, rejectionReason } = p;
              return (
                <LDCDashboardListItem
                  key={p.id}
                  image={p.image}
                  title={p.title}
                  meta={
                    <>
                      {status === "rejected" && rejectionReason ? (
                        <LDCRejectionReasonDialog
                          title={p.title}
                          reason={rejectionReason}
                          fixHref={editHref(p.id)}
                          badgeLabel={STATUS_LABELS.rejected}
                        />
                      ) : (
                        <LDCBadge variant={`status-${status}`}>{STATUS_LABELS[status]}</LDCBadge>
                      )}
                      <span className="font-open-sans text-xs text-muted-foreground">
                        {getPropertyTypeLabel(publicType(p))} en {getOperationLabel(publicOperation(p)).toLowerCase()}
                      </span>
                    </>
                  }
                  subtitle={[priceText(p), [p.commune, p.city.name].filter(Boolean).join(", "), featuresText(p)]
                    .filter(Boolean)
                    .join(" · ")}
                  actions={
                    <>
                      {status === "rejected" ? (
                        <LDCButton href={editHref(p.id)} size="sm">
                          <Pencil />
                          Corregir y reenviar
                        </LDCButton>
                      ) : (
                        <LDCButton href={editHref(p.id)} variant="outline" size="sm">
                          <Pencil />
                          Editar
                        </LDCButton>
                      )}
                      {status === "published" && (
                        <LDCButton href={`/propiedad/${p.slug}`} variant="ghost" size="sm">
                          <ExternalLink />
                          Ver en La Guía
                        </LDCButton>
                      )}
                      <LDCArchiveButton
                        kind="property"
                        id={p.id}
                        slug={p.slug}
                        title={p.title}
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
