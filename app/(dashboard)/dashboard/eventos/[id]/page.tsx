import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCEventForm } from "@/components/organisms/ldc-event-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCategories, getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyEvent } from "@/services/me/events";
import { updateMyEventAction } from "../actions";

export const metadata = {
  title: "Editar evento — Panel",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface EditarEventoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edición de un evento propio (`PATCH /me/events/:id`, queda en revisión). El evento sale de
 * `GET /me/events/:id` (solo los de la cuenta): si el id no es suyo, 404. Llegan aquí «Editar» y
 * «Corregir y reenviar» de «Mis eventos».
 */
export default async function EditarEventoPage({ params }: EditarEventoPageProps) {
  const [, { id }, categories, cities] = await Promise.all([
    requireDashboardRole("organizador"),
    params,
    getCategories(),
    getCities(),
  ]);
  if (!UUID.test(id)) notFound();
  const event = await getMyEvent(id);
  if (!event) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar evento"
      description="Al guardar, tu evento pasa a revisión y vuelve a La Guía cuando lo aprobemos."
      actions={
        event.status === "published" ? (
          <LDCButton href={`/evento/${event.slug}`} variant="outline">
            <ExternalLink aria-hidden />
            Ver en La Guía
          </LDCButton>
        ) : undefined
      }
    >
      <LDCEventForm
        key={event.id}
        event={event}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={updateMyEventAction}
      />
    </LDCDashboardPageTemplate>
  );
}
