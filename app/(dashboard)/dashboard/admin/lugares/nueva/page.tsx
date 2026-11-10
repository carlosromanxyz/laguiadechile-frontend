import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCPlaceForm } from "@/components/organisms/ldc-place-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCities } from "@/lib/api/catalog";
import { placeToValues } from "@/validations/place-form-schema";
import { createPlaceAction } from "../actions";

export const metadata = {
  title: "Nuevo lugar — Panel",
};

/** Alta de un lugar (CLGDC-207). */
export default async function NewPlacePage() {
  const cities = await getCities();
  return (
    <LDCDashboardPageTemplate
      title="Nuevo lugar"
      description="Se publica en el sitio al guardarlo."
      actions={<LDCBackLink href="/dashboard/admin/lugares" label="Volver a Lugares" />}
    >
      <LDCPlaceForm
        mode="create"
        action={createPlaceAction}
        returnHref="/dashboard/admin/lugares"
        initial={placeToValues()}
        cities={cities.map(({ id, name, slug }) => ({ id, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
