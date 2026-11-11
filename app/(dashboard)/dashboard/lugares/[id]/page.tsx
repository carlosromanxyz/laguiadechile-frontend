import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCPlaceForm } from "@/components/organisms/ldc-place-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyPlace } from "@/services/me/places";
import { myPlaceToValues } from "@/validations/place-form-schema";
import { updateMyPlaceAction } from "../actions";

export const metadata = {
  title: "Editar lugar — Panel",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface EditarLugarPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edición de un lugar propio (`PATCH /me/places/:id`, queda en revisión; CLGDC-209). El lugar sale
 * de `GET /me/places/:id` (solo los de la cuenta): si el id no es suyo, 404. Llegan aquí «Editar» y
 * «Corregir y reenviar» de «Mis lugares».
 */
export default async function EditarLugarPage({ params }: EditarLugarPageProps) {
  const [, { id }, cities] = await Promise.all([requireDashboardRole("colaborador"), params, getCities()]);
  if (!UUID.test(id)) notFound();
  const place = await getMyPlace(id);
  if (!place) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar lugar"
      description="Al guardar, tu lugar pasa a revisión y vuelve a La Guía cuando lo aprobemos."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <LDCBackLink href="/dashboard/lugares" label="Volver a Mis lugares" />
          {place.status === "published" && (
            <LDCButton href={`/lugar/${place.slug}`} variant="outline">
              <ExternalLink aria-hidden />
              Ver en La Guía
            </LDCButton>
          )}
        </div>
      }
    >
      <LDCPlaceForm
        key={place.id}
        mode="edit"
        variant="owner"
        action={updateMyPlaceAction.bind(null, place.id)}
        returnHref="/dashboard/lugares"
        initial={myPlaceToValues(place)}
        cities={cities.map(({ id: cityId, name, slug }) => ({ id: cityId, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
