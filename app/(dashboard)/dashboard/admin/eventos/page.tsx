import { CalendarDays } from "lucide-react";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { loadAdminEventsPage } from "@/services/admin/events";
import { ADMIN_PAGE_SIZE } from "@/services/admin/listings";
import { setAdminEventStatusAction } from "../events-actions";

export const metadata = {
  title: "Eventos — Panel",
};

const BASE = "/dashboard/admin/eventos";

interface AdminEventosPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Eventos» del admin (CLGDC-140, alternativa B de CLGDC-114 como «Avisos»): los eventos en todos
 * sus estados (uno publicado que ya terminó cuenta como «Vencido»), con búsqueda, ciudad, estado y
 * paginación en la URL, y la moderación de cada fila (`PATCH /admin/events/:id/status`).
 */
export default async function AdminEventosPage({ searchParams }: AdminEventosPageProps) {
  const { data, cities, filters } = await loadAdminEventsPage(await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate title="Eventos" description="Eventos de los organizadores, por venir y terminados.">
      <LDCAdminPublicationList
        label="Listado de eventos"
        noun={{ header: "Evento", one: "evento", many: "eventos", gender: "m" }}
        kind="event"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/evento"
        onSetStatus={setAdminEventStatusAction}
        emptyIcon={<CalendarDays className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay eventos"
        emptyDescription="Cuando un organizador publique un evento, aparecerá aquí con su estado."
      />
    </LDCDashboardPageTemplate>
  );
}
