import { LDCEventForm } from "@/components/organisms/ldc-event-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCategories, getCities } from "@/lib/api/catalog";
import { hasAnyRole } from "@/lib/auth/roles";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { getMyEvent } from "@/services/me/events";
import { createMyEventAction } from "../actions";

export const metadata = {
  title: "Publicar un evento — Panel",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface NuevoEventoPageProps {
  searchParams: Promise<{ desde?: string | string[] }>;
}

/**
 * Alta de un evento (`POST /me/events`). Entra cualquier cuenta con sesión: al publicar el primer
 * evento, la cuenta suma el rol organizador sin perder los suyos. El organizador se precarga con
 * el nombre y el correo de la cuenta. Con `?desde=<id>` («Duplicar» en «Mis eventos») parte de un
 * evento propio, con todo menos las fechas. Al enviarlo, el formulario lleva a «Mis eventos».
 */
export default async function NuevoEventoPage({ searchParams }: NuevoEventoPageProps) {
  const [session, { desde }, categories, cities] = await Promise.all([
    requireDashboardSession(),
    searchParams,
    getCategories(),
    getCities(),
  ]);
  const fromId = Array.isArray(desde) ? desde[0] : desde;
  const copyFrom =
    fromId && UUID.test(fromId) && hasAnyRole(session.roles, ["organizador"])
      ? ((await getMyEvent(fromId)) ?? undefined)
      : undefined;

  return (
    <LDCDashboardPageTemplate
      title={copyFrom ? "Duplica tu evento" : "Publica un evento"}
      description={
        copyFrom
          ? `Copiamos «${copyFrom.title}» sin las fechas. Elige cuándo es esta vez y envíalo a revisión.`
          : "Cuéntanos qué es, cuándo y dónde, y cómo contactarte. Lo revisamos antes de publicarlo."
      }
    >
      <LDCEventForm
        mode="create"
        defaultOrganizer={{ name: session.user.name, email: session.user.email }}
        copyFrom={copyFrom}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={createMyEventAction}
        successHref="/dashboard/eventos"
      />
    </LDCDashboardPageTemplate>
  );
}
