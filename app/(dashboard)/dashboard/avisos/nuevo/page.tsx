import { LDCClassifiedForm } from "@/components/organisms/ldc-classified-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCategories, getCities } from "@/lib/api/catalog";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { createMyClassifiedAction } from "../actions";

export const metadata = {
  title: "Publicar un aviso — Panel",
};

/**
 * Alta de un aviso clasificado (`POST /me/classifieds`). Entra cualquier cuenta con sesión: al
 * publicar el primer aviso, la cuenta suma el rol avisador sin perder los suyos. El contacto se
 * precarga con el nombre y el correo de la cuenta. Al enviarlo, el formulario lleva a «Mis avisos».
 */
export default async function NuevoAvisoPage() {
  const [session, categories, cities] = await Promise.all([
    requireDashboardSession(),
    getCategories(),
    getCities(),
  ]);

  return (
    <LDCDashboardPageTemplate
      title="Publica un aviso"
      description="Cuéntanos qué ofreces o buscas, dónde y cómo contactarte. Lo revisamos antes de publicarlo."
    >
      <LDCClassifiedForm
        mode="create"
        defaultContact={{ name: session.user.name, email: session.user.email }}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={createMyClassifiedAction}
        successHref="/dashboard/avisos"
      />
    </LDCDashboardPageTemplate>
  );
}
