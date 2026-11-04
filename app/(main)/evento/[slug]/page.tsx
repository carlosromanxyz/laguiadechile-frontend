import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import { getEventBySlug, getEventSlugs, getRelatedEvents } from "@/lib/api/events";
import { descriptionHtmlToText } from "@/lib/format/description";
import { formatEventWhen, isPastEvent } from "@/lib/format/events";

interface EventoPageProps {
  params: Promise<{ slug: string }>;
}

/** Slugs de los eventos publicados. */
export async function generateStaticParams() {
  return getEventSlugs();
}

/** Título con ciudad y fecha; descripción en texto plano (160) y la imagen para Open Graph. */
export async function generateMetadata({ params }: EventoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Evento no encontrado - La Guía de Chile" };
  }

  const description = descriptionHtmlToText(event.description).replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${event.title} - ${formatEventWhen(event.startsAt, event.endsAt)} en ${event.city.name} | La Guía de Chile`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: [event.image],
    },
  };
}

/**
 * Evento - Detalle público (CLGDC-139)
 *
 * Hero (categoría, fechas, lugar, compartir y favorito), galería, descripción, mapa, entrada (con
 * enlace de compra si hay) y organizador con sus contactos; al final, otros eventos próximos de
 * la misma categoría o ciudad. 404 si no existe o no está publicado (la API responde 404).
 */
export default async function EventoPage({ params }: EventoPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const related = await getRelatedEvents(event, 4);

  return <LDCDetailTemplate kind="evento" event={event} related={related} past={isPastEvent(event)} />;
}
