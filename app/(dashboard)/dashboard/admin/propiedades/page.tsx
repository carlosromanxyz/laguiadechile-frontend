import { House, Plus } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCAdminPublicationList } from "@/components/organisms/ldc-admin-publication-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE } from "@/services/admin/listings";
import { loadAdminPropertiesPage } from "@/services/admin/properties";
import { setAdminPropertyStatusAction } from "./actions";

export const metadata = {
  title: "Propiedades — Panel",
};

const BASE = "/dashboard/admin/propiedades";

interface AdminPropiedadesPageProps {
  searchParams: Promise<IAdminListSearchParams>;
}

/**
 * «Propiedades» del admin (alternativa B de CLGDC-114, CLGDC-164): las propiedades en todos sus
 * estados (`GET /admin/properties`): las del admin y el seed, y las de los dueños con su moderación.
 * Búsqueda, ciudad, estado y paginación en la URL; mismo listado que «Avisos». Crear y editar van en
 * página propia («Nueva» y «Editar»); borrar, en el formulario de edición.
 */
export default async function AdminPropiedadesPage({ searchParams }: AdminPropiedadesPageProps) {
  const { data, cities, filters } = await loadAdminPropertiesPage(await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate
      title="Propiedades"
      description="Propiedades en venta y arriendo: las del equipo y las de sus dueños, en todos sus estados."
      actions={
        <LDCButton href={`${BASE}/nueva`}>
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCAdminPublicationList
        label="Listado de propiedades"
        noun={{ header: "Propiedad", one: "propiedad", many: "propiedades", gender: "f" }}
        kind="property"
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={ADMIN_PAGE_SIZE}
        counts={data.counts}
        q={filters.q}
        city={filters.city}
        status={filters.status}
        cities={cities}
        publicPathPrefix="/propiedad"
        editPathPrefix={BASE}
        onSetStatus={setAdminPropertyStatusAction}
        emptyIcon={<House className="size-8 text-muted-foreground" aria-hidden />}
        emptyTitle="Aún no hay propiedades"
        emptyDescription="Crea la primera con «Nueva» o espera a que un dueño publique la suya."
      />
    </LDCDashboardPageTemplate>
  );
}
