import { LDCPropertyForm } from "@/components/organisms/ldc-property-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCities } from "@/lib/api/catalog";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { createMyPropertyAction } from "../actions";

export const metadata = {
  title: "Publicar una propiedad — Panel",
};

/**
 * Alta de una propiedad (`POST /me/properties`, CLGDC-164). Entra cualquier cuenta con sesión: al
 * publicar la primera, la cuenta suma el rol propietario sin perder los suyos. El contacto se
 * precarga con el nombre y el correo de la cuenta. Al enviarla, el formulario lleva a «Mis
 * propiedades».
 */
export default async function NuevaPropiedadPage() {
  const [session, cities] = await Promise.all([requireDashboardSession(), getCities()]);

  return (
    <LDCDashboardPageTemplate
      title="Publica una propiedad"
      description="Cuéntanos qué vendes o arriendas, dónde y cómo contactarte. La revisamos antes de publicarla."
    >
      <LDCPropertyForm
        variant="owner"
        mode="create"
        defaultContact={{ name: session.user.name, email: session.user.email }}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={createMyPropertyAction}
        successHref="/dashboard/propiedades"
      />
    </LDCDashboardPageTemplate>
  );
}
