import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCPropertyForm } from "@/components/organisms/ldc-property-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyProperties } from "@/services/me/properties";
import { updateMyPropertyAction } from "../actions";

export const metadata = {
  title: "Editar propiedad — Panel",
};

interface EditarPropiedadPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edición de una propiedad propia (`PATCH /me/properties/:id`, queda en revisión). La propiedad
 * sale de `GET /me/properties` (solo las de la cuenta): si el id no es suyo, 404. Llegan aquí
 * «Editar» y «Corregir y reenviar» de «Mis propiedades».
 */
export default async function EditarPropiedadPage({ params }: EditarPropiedadPageProps) {
  const [, { id }, properties, cities] = await Promise.all([
    requireDashboardRole("propietario"),
    params,
    getMyProperties(),
    getCities(),
  ]);

  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar propiedad"
      description="Al guardar, tu propiedad pasa a revisión y vuelve a La Guía cuando la aprobemos."
      actions={
        property.status === "published" ? (
          <LDCButton href={`/propiedad/${property.slug}`} variant="outline">
            <ExternalLink aria-hidden />
            Ver en La Guía
          </LDCButton>
        ) : undefined
      }
    >
      <LDCPropertyForm
        key={property.id}
        variant="owner"
        mode="edit"
        property={property}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={updateMyPropertyAction}
      />
    </LDCDashboardPageTemplate>
  );
}
