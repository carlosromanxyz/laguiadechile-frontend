import { LDCListingForm } from "@/components/organisms/ldc-listing-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { DASHBOARD_PUBLISH_ROLES } from "@/config/dashboard-navigation";
import { getCategories, getCities } from "@/lib/api/catalog";
import { hasAnyRole } from "@/lib/auth/roles";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { createMyListingAction } from "./actions";

export const metadata = {
  title: "Publicar tu comercio o servicio — Panel",
};

interface PublicarPageProps {
  searchParams: Promise<{ tipo?: string | string[] }>;
}

/**
 * Alta de una ficha propia (`POST /me/listings`). Entra quien tenga usuario, comercio o servicio
 * (al publicar, la cuenta suma comercio o servicio según el tipo); un admin sin esos roles vuelve
 * al inicio. `?tipo=servicio` abre con Servicio elegido. Al enviarla, el formulario lleva a
 * `/dashboard/comercio`.
 */
export default async function PublicarPage({ searchParams }: PublicarPageProps) {
  const [session, { tipo }, categories, cities] = await Promise.all([
    requireDashboardRole(DASHBOARD_PUBLISH_ROLES),
    searchParams,
    getCategories(),
    getCities(),
  ]);

  return (
    <LDCDashboardPageTemplate
      title={
        hasAnyRole(session.roles, ["comercio", "servicio"])
          ? "Publicar otra ficha"
          : "Publica tu comercio o servicio"
      }
      description="Cuéntanos qué ofreces, dónde y cómo contactarte. La revisamos antes de publicarla en la guía."
    >
      <LDCListingForm
        mode="create"
        defaultType={tipo === "servicio" ? "servicio" : "comercio"}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={createMyListingAction}
        successHref="/dashboard/comercio"
      />
    </LDCDashboardPageTemplate>
  );
}
