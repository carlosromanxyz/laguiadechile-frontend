import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCPropertyForm } from "@/components/organisms/ldc-property-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCitiesService } from "@/services/admin/cities";
import { propertyToValues } from "@/validations/admin-catalog-schema";
import { createPropertyAction } from "../actions";

export const metadata = {
  title: "Nueva propiedad — Panel",
};

export default async function NewPropertyPage() {
  const cities = await adminCitiesService.list({ limit: 500 });
  return (
    <LDCDashboardPageTemplate
      title="Nueva propiedad"
      description="Se publica en el sitio al guardarla."
      actions={<LDCBackLink href="/dashboard/admin/propiedades" label="Volver a Propiedades" />}
    >
      <LDCPropertyForm
        mode="create"
        action={createPropertyAction}
        returnHref="/dashboard/admin/propiedades"
        initial={propertyToValues()}
        cities={cities
          .map(({ id, name, slug }) => ({ id, name, slug }))
          .sort((a, b) => a.name.localeCompare(b.name, "es"))}
      />
    </LDCDashboardPageTemplate>
  );
}
