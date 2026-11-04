import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { LDCEventFilters } from "@/components/organisms/ldc-event-filters";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedEventsGrid } from "@/components/organisms/ldc-paginated-events-grid";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import type { IEventWhen } from "@/interfaces/event";
import { getEventsPage } from "@/lib/api/events";

export const metadata: Metadata = {
  title: "Eventos - La Guía de Chile",
  description:
    "Ferias, conciertos, talleres y panoramas en todo Chile. Encuentra eventos por fecha, ciudad y categoría.",
};

const WHEN_KEYS: readonly IEventWhen[] = ["proximos", "semana", "mes", "pasados"];
const SLUG = /^[a-z0-9-]{1,200}$/;

interface EventosPageProps {
  searchParams: Promise<{ cuando?: string | string[]; ciudad?: string | string[]; categoria?: string | string[] }>;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Eventos - La Guía de Chile (CLGDC-139)
 *
 * Listado público de eventos publicados: por defecto los próximos (en curso o por venir), del más
 * próximo al más lejano. Filtros en la URL: `?cuando=` (semana, mes, pasados), `?ciudad=` y
 * `?categoria=` por slug. Grilla de `LDCEventCard` con «Cargar más» y estado vacío.
 */
export default async function EventosPage({ searchParams }: EventosPageProps) {
  const params = await searchParams;
  const rawWhen = first(params.cuando);
  const when = (WHEN_KEYS as readonly string[]).includes(rawWhen) ? (rawWhen as IEventWhen) : "proximos";
  const city = SLUG.test(first(params.ciudad)) ? first(params.ciudad) : "";
  const category = SLUG.test(first(params.categoria)) ? first(params.categoria) : "";

  const page = await getEventsPage({ when, city, category });

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Eventos", href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={<LDCListingsPageHero title="Eventos" breadcrumbs={breadcrumbs} icon={CalendarDays} />}
    >
      <LDCPaginatedEventsGrid
        key={`${when}|${city}|${category}`}
        events={page.events}
        now={page.now}
        filters={
          <LDCEventFilters
            when={when}
            city={city}
            category={category}
            counts={page.counts}
            cities={page.cities}
            categories={page.categories}
          />
        }
        emptyTitle={when === "pasados" ? "No hay eventos pasados con estos filtros" : "No encontramos eventos"}
      />
    </LDCListingPageTemplate>
  );
}
