import { LDCListingForm } from "@/components/organisms/ldc-listing-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCategories, getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { createMyListingAction } from "./actions";

export const metadata = {
  title: "Publicar tu comercio o servicio — Panel",
};

interface PublicarPageProps {
  searchParams: Promise<{ tipo?: string | string[] }>;
}

/**
 * Alta de una ficha propia (`POST /me/listings`). La comparten el usuario (al publicar pasa a
 * comercio) y el comercio (otra ficha más); el admin vuelve a su inicio. `?tipo=servicio` abre con
 * Servicio elegido. Al enviarla, el formulario lleva a `/dashboard/comercio`.
 */
export default async function PublicarPage({ searchParams }: PublicarPageProps) {
  const [session, { tipo }, categories, cities] = await Promise.all([
    requireDashboardRole(["usuario", "comercio"]),
    searchParams,
    getCategories(),
    getCities(),
  ]);

  return (
    <LDCDashboardPageTemplate
      title={session.role === "comercio" ? "Publicar otra ficha" : "Publica tu comercio o servicio"}
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
