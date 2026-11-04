import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCResourceRowActions } from "@/components/organisms/ldc-resource-row-actions";
import { LDCPropertyForm } from "@/components/organisms/ldc-property-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { ApiError } from "@/lib/api-client";
import { adminCitiesService } from "@/services/admin/cities";
import { adminPropertiesService } from "@/services/admin/properties";
import { propertyToValues } from "@/validations/admin-catalog-schema";
import { deletePropertyAndReturnAction, updatePropertyAction } from "../actions";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata = {
  title: "Editar propiedad — Panel",
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  // `GET /admin/properties/:id` (CLGDC-164): cualquier estado, también las de los dueños.
  const [property, cities] = await Promise.all([
    adminPropertiesService.get(id).catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }),
    adminCitiesService.list({ limit: 500 }),
  ]);
  if (!property) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar propiedad"
      description={property.title}
      actions={
        <div className="flex items-center gap-2">
          <LDCBackLink href="/dashboard/admin/propiedades" label="Volver a Propiedades" />
          {/* Borrar quedó aquí al pasar el listado a `LDCAdminPublicationList` (CLGDC-164). */}
          <LDCResourceRowActions
            onDelete={deletePropertyAndReturnAction.bind(null, property.id)}
            deleteLabel="¿Eliminar esta propiedad?"
            deleteDescription={`«${property.title}» deja de verse en el sitio. Esta acción no se puede deshacer.`}
          />
        </div>
      }
    >
      <LDCPropertyForm
        mode="edit"
        action={updatePropertyAction.bind(null, property.id)}
        returnHref="/dashboard/admin/propiedades"
        initial={propertyToValues(property)}
        status={property.status}
        cities={cities
          .map(({ id: cityId, name, slug }) => ({ id: cityId, name, slug }))
          .sort((a, b) => a.name.localeCompare(b.name, "es"))}
      />
    </LDCDashboardPageTemplate>
  );
}
