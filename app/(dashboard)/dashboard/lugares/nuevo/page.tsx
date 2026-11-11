import { LDCPlaceForm } from "@/components/organisms/ldc-place-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCities } from "@/lib/api/catalog";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { myPlaceToValues } from "@/validations/place-form-schema";
import { createMyPlaceAction } from "../actions";

export const metadata = {
  title: "Publicar un lugar — Panel",
};

/**
 * Alta de un lugar (`POST /me/places`, CLGDC-209). Entra cualquier cuenta con sesión: al publicar el
 * primer lugar, la cuenta suma el rol colaborador sin perder los suyos. Usa `LDCPlaceForm` en
 * `variant="owner"` (sin slug, «Destacado» ni número de emergencia). Al enviarlo, lleva a «Mis
 * lugares».
 */
export default async function NuevoLugarPage() {
  const [, cities] = await Promise.all([requireDashboardSession(), getCities()]);

  return (
    <LDCDashboardPageTemplate
      title="Publica un lugar"
      description="Un atractivo, una feria o un servicio público de tu ciudad. Lo revisamos antes de publicarlo."
    >
      <LDCPlaceForm
        mode="create"
        variant="owner"
        action={createMyPlaceAction}
        returnHref="/dashboard/lugares"
        initial={myPlaceToValues()}
        cities={cities.map(({ id, name, slug }) => ({ id, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
