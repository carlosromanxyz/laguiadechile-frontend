import { Tags } from "lucide-react";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { loadAdminClassifiedsPage } from "@/services/admin/classifieds";
import { ADMIN_PAGE_SIZE } from "@/services/admin/listings";
import { setAdminClassifiedStatusAction } from "../classifieds-actions";

export const metadata = {
  title: "Avisos — Panel",
};

const BASE = "/dashboard/admin/avisos";

interface AdminAvisosPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Avisos» del admin (alternativa B de CLGDC-114, CLGDC-127): los avisos clasificados en todos sus
 * estados (un publicado con `expiresAt` pasado cuenta como «Vencido»), con búsqueda, ciudad, estado
 * y paginación en la URL. Mismo listado que «Comercios».
 */
export default async function AdminAvisosPage({ searchParams }: AdminAvisosPageProps) {
  const { data, cities, filters } = await loadAdminClassifiedsPage(await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate title="Avisos" description="Avisos clasificados, vigentes y vencidos.">
      <LDCAdminPublicationList
        label="Listado de avisos"
        noun={{ header: "Aviso", one: "aviso", many: "avisos", gender: "m" }}
        kind="classified"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/aviso"
        onSetStatus={setAdminClassifiedStatusAction}
        emptyIcon={<Tags className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay avisos"
        emptyDescription="Cuando alguien publique un aviso, aparecerá aquí con su estado."
      />
    </LDCDashboardPageTemplate>
  );
}
