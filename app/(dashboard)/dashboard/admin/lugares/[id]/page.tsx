import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCPlaceForm } from "@/components/organisms/ldc-place-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { ApiError } from "@/lib/api-client";
import { getCities } from "@/lib/api/catalog";
import { adminPlacesService } from "@/services/admin/places";
import { placeToValues } from "@/validations/place-form-schema";
import { updatePlaceAction } from "../actions";

export const metadata = {
  title: "Editar lugar — Panel",
};

/** Edición de un lugar (CLGDC-207). La API expone `GET /places/:slug`, no por id: se busca en el listado. */
export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [places, cities] = await Promise.all([
    adminPlacesService.list({ limit: 200 }).catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) return [];
      throw e;
    }),
    getCities(),
  ]);
  const item = places.find((p) => p.id === id);
  if (!item) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar lugar"
      description={item.title}
      actions={<LDCBackLink href="/dashboard/admin/lugares" label="Volver a Lugares" />}
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
