import { Wrench } from "lucide-react";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE, loadAdminListingsPage } from "@/services/admin/listings";
import { setAdminListingStatusAction } from "../listings-actions";

export const metadata = {
  title: "Servicios — Panel",
};

const BASE = "/dashboard/admin/servicios";

interface AdminServiciosPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Servicios» del admin (CLGDC-156): las fichas `type=SERVICIO` en todos sus estados, con el mismo
 * listado que «Comercios» (ítem propio del menú Admin, no una pestaña de Comercios).
 */
export default async function AdminServiciosPage({ searchParams }: AdminServiciosPageProps) {
  const { data, cities, filters } = await loadAdminListingsPage("SERVICIO", await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate title="Servicios" description="Fichas de servicios en todos sus estados.">
      <LDCAdminPublicationList
        label="Listado de servicios"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/servicio"
        onSetStatus={setAdminListingStatusAction}
        emptyIcon={<Wrench className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay servicios"
        emptyDescription="Cuando un servicio publique su ficha, aparecerá aquí con su estado."
      />
    </LDCDashboardPageTemplate>
  );
}
