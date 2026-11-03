import { Store } from "lucide-react";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE, loadAdminListingsPage } from "@/services/admin/listings";
import { setAdminListingStatusAction } from "../listings-actions";

export const metadata = {
  title: "Comercios — Panel",
};

const BASE = "/dashboard/admin/comercios";

interface AdminComerciosPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Comercios» del admin (alternativa B de CLGDC-114, CLGDC-156): las fichas `type=COMERCIO` en todos
 * sus estados, con búsqueda, ciudad, estado y paginación en la URL. Los servicios tienen su propia
 * página (`/dashboard/admin/servicios`).
 */
export default async function AdminComerciosPage({ searchParams }: AdminComerciosPageProps) {
  const { data, cities, filters } = await loadAdminListingsPage("COMERCIO", await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate title="Comercios" description="Fichas de comercios en todos sus estados.">
      <LDCAdminPublicationList
        label="Listado de comercios"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/comercio"
        onSetStatus={setAdminListingStatusAction}
        emptyIcon={<Store className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay comercios"
        emptyDescription="Cuando un comercio publique su ficha, aparecerá aquí con su estado."
      />
    </LDCDashboardPageTemplate>
  );
}
