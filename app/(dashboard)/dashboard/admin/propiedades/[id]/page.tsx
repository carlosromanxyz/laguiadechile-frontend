import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCPropertyForm } from "@/components/organisms/ldc-property-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCitiesService } from "@/services/admin/cities";
import { adminPropertiesService } from "@/services/admin/properties";
import { propertyToValues } from "@/validations/admin-catalog-schema";
import { updatePropertyAction } from "../actions";

export const metadata = {
  title: "Editar propiedad — Panel",
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // La API expone `GET /properties/:slug`, no por id: se busca en el listado (máx. 200).
  const [properties, cities] = await Promise.all([
    adminPropertiesService.list({ limit: 200 }),
    adminCitiesService.list({ limit: 500 }),
  ]);
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar propiedad"
      description={property.title}
      actions={<LDCBackLink href="/dashboard/admin/propiedades" label="Volver a Propiedades" />}
    >
      <LDCPropertyForm
        mode="edit"
        action={updatePropertyAction.bind(null, property.id)}
        returnHref="/dashboard/admin/propiedades"
        initial={propertyToValues(property)}
        cities={cities
          .map(({ id: cityId, name, slug }) => ({ id: cityId, name, slug }))
          .sort((a, b) => a.name.localeCompare(b.name, "es"))}
      />
    </LDCDashboardPageTemplate>
  );
}
