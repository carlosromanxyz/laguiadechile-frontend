import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCPlaceForm } from "@/components/organisms/ldc-place-form";
import { LDCResourceRowActions } from "@/components/organisms/ldc-resource-row-actions";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { ApiError } from "@/lib/api-client";
import { getCities } from "@/lib/api/catalog";
import { adminPlacesService } from "@/services/admin/places";
import { placeToValues } from "@/validations/place-form-schema";
import { deletePlaceAndReturnAction, updatePlaceAction } from "../actions";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata = {
  title: "Editar lugar — Panel",
};

/**
 * Edición de un lugar (CLGDC-207). Desde CLGDC-209 lo lee `GET /admin/places/:id`: cualquier
 * estado, también los que publican las cuentas. Borrar va aquí, como en propiedades.
 */
export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [item, cities] = await Promise.all([
    adminPlacesService.get(id).catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }),
    getCities(),
  ]);
  if (!item) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar lugar"
      description={item.title}
      actions={
        <div className="flex items-center gap-2">
          <LDCBackLink href="/dashboard/admin/lugares" label="Volver a Lugares" />
          <LDCResourceRowActions
            onDelete={deletePlaceAndReturnAction.bind(null, item.id)}
            deleteLabel="¿Eliminar este lugar?"
            deleteDescription={`«${item.title}» deja de verse en el sitio. Esta acción no se puede deshacer.`}
          />
        </div>
      }
    >
      <LDCPlaceForm
        mode="edit"
        action={updatePlaceAction.bind(null, item.id)}
        returnHref="/dashboard/admin/lugares"
        initial={placeToValues(item)}
        cities={cities.map(({ id: cityId, name, slug }) => ({ id: cityId, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
