import { MapPinned, Plus } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE } from "@/services/admin/listings";
import { loadAdminPlacesPage } from "@/services/admin/places";
import { setAdminPlaceStatusAction } from "./actions";

export const metadata = {
  title: "Lugares — Panel",
};

const BASE = "/dashboard/admin/lugares";

interface AdminLugaresPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Lugares» del admin (CLGDC-207; con moderación desde CLGDC-209): los lugares en todos sus estados
 * (`GET /admin/places`): los de La Guía de Chile y el seed, y los que publican las cuentas, con su
 * moderación. Búsqueda, ciudad, estado (sin «Vencidos»: los lugares no vencen) y paginación en la
 * URL; mismo listado que «Propiedades». Crear y editar van en página propia; borrar, en la edición.
 */
export default async function AdminLugaresPage({ searchParams }: AdminLugaresPageProps) {
  const { data, cities, filters } = await loadAdminPlacesPage(await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate
      title="Lugares"
      description="Atractivos, servicios públicos y ferias: los de La Guía de Chile y los que publican las cuentas, en todos sus estados."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nuevo
        </LDCButton>
      }
    >
      <LDCAdminPublicationList
        label="Listado de lugares"
        noun={{ header: "Lugar", one: "lugar", many: "lugares", gender: "m" }}
        kind="place"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/lugar"
        editPathPrefix={BASE}
        onSetStatus={setAdminPlaceStatusAction}
        emptyIcon={<MapPinned className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay lugares"
        emptyDescription="Crea el primero con «Nuevo» o espera a que una cuenta publique uno."
      />
    </LDCDashboardPageTemplate>
  );
}
