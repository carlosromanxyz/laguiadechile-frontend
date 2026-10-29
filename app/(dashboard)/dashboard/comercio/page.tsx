import Image from "next/image";
import { ChevronRight, Eye, Globe, MessageCircle, Phone } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCProfileCompletion } from "@/components/molecules/ldc-profile-completion";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDCContactSummary } from "@/components/organisms/ldc-contact-summary";
import { LDCResourceTable } from "@/components/organisms/ldc-resource-table";
import { LDCTaskList } from "@/components/organisms/ldc-task-list";
import { LDCVisitsChart } from "@/components/organisms/ldc-visits-chart";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import { requireDashboardRole } from "@/lib/dashboard/session";
import {
  getMyContactSummary,
  getMyListings,
  getMyProfileCompletion,
  getMyStats,
  getMyTasks,
  getMyVisitsSeries,
} from "@/services/dashboard/comercio";

export const metadata = {
  title: "Inicio — Panel",
};

const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicada",
  review: "En revisión",
  expired: "Vencida",
  rejected: "Rechazada",
};

const numberFormat = new Intl.NumberFormat("es-CL");

export default async function ComercioHomePage() {
  const [session, stats, series, completion, listings, contact, tasks] = await Promise.all([
    requireDashboardRole("comercio"),
    getMyStats(),
    getMyVisitsSeries(),
    getMyProfileCompletion(),
    getMyListings(),
    getMyContactSummary(),
    getMyTasks(),
  ]);

  return (
    <LDCDashboardPageTemplate
      title={`Hola, ${session.user.greetingName}`}
      description="Así le fue a tu ficha en los últimos 30 días."
      actions={<LDCCTAButton href="/publicar" text="Publicar" />}
    >
      <LDCTaskList tasks={tasks} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <LDCStatCard
          label="Visitas a tu ficha"
          value={stats.visits}
          icon={<Eye className="size-4" />}
          trend={stats.visitsDelta ?? undefined}
          hint={stats.visitsDelta === null ? "sin visitas en los 30 días previos" : "vs. 30 días previos"}
        />
        <LDCStatCard
          label="Clics en WhatsApp"
          value={stats.whatsapp}
          icon={<MessageCircle className="size-4" />}
        />
        <LDCStatCard label="Llamadas" value={stats.calls} icon={<Phone className="size-4" />} />
        <LDCStatCard
          label="Clics a tu sitio web"
          value={stats.web}
          icon={<Globe className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <LDCVisitsChart points={series} />
        {completion && (
          <LDCProfileCompletion
            pct={completion.pct}
            items={completion.items}
            actionHref="/dashboard/comercio/ficha"
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <LDCDashboardCard
          title="Mis publicaciones"
          variant="plain"
          action={
            <LDCButton href="/dashboard/comercio/publicaciones" variant="ghost" size="sm">
              Ver todas
              <ChevronRight />
            </LDCButton>
          }
        >
          <LDCResourceTable
            rows={listings}
            getRowKey={(l) => l.item.id}
            emptyMessage="Aún no tienes publicaciones."
            actionsHeader={<span className="sr-only">Acciones</span>}
            isRowHighlighted={(l) => l.item.featured && l.ownership.status === "published"}
            columns={[
              {
                key: "title",
                header: "Publicación",
                cellClassName: "w-full max-w-0",
                cell: (l) => (
                  <div className="flex min-w-0 items-center gap-2">
                    <Image
                      src={l.item.image}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md bg-muted object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{l.item.title}</p>
                      <p className="truncate font-open-sans text-xs text-muted-foreground">
                        {l.item.category.name} · {l.item.city.name}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Estado",
                cell: (l) => (
                  <LDCBadge variant={`status-${l.ownership.status}`}>
                    {STATUS_LABELS[l.ownership.status]}
                  </LDCBadge>
                ),
              },
              {
                key: "featured",
                header: <span className="sr-only">Destacado</span>,
                headClassName: "hidden md:table-cell",
                cellClassName: "hidden md:table-cell",
                cell: (l) =>
                  l.item.featured && l.ownership.status === "published" ? (
                    <LDCBadge variant="featured">Destacado</LDCBadge>
                  ) : (
                    "—"
                  ),
              },
              {
                key: "visits",
                header: "Visitas",
                headClassName: "hidden text-right md:table-cell",
                cellClassName: "hidden text-right font-bold md:table-cell",
                cell: (l) =>
                  l.ownership.visits30d != null ? numberFormat.format(l.ownership.visits30d) : "—",
              },
            ]}
            getRowActions={() => ({ editHref: "/dashboard/comercio/ficha" })}
          />
        </LDCDashboardCard>
        {contact && (
          <LDCContactSummary contact={contact} editHref="/dashboard/comercio/horario-y-contacto" />
        )}
      </div>
    </LDCDashboardPageTemplate>
  );
}
