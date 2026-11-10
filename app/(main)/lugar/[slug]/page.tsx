import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import type { IPlace } from "@/interfaces/place";
import { getListingsByCity } from "@/lib/api/listings";
import { getPlaceBySlug, getPlaceSlugs } from "@/lib/api/places";
import { descriptionHtmlToText } from "@/lib/format/description";
import { PLACE_TYPE_META, chileWeekdayIndex } from "@/lib/format/places";

interface LugarPageProps {
  params: Promise<{ slug: string }>;
}

/** Slugs de todos los lugares (vacío si la API aún no tiene `/places`). */
export async function generateStaticParams() {
  return getPlaceSlugs();
}

/** Título con tipo y ciudad; descripción en texto plano (160) y la imagen para Open Graph. */
export async function generateMetadata({ params }: LugarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return { title: "Lugar no encontrado - La Guía de Chile" };

  const description = descriptionHtmlToText(place.description).replace(/\s+/g, " ").trim().slice(0, 160);
  return {
    title: `${place.title} - ${PLACE_TYPE_META[place.type].label} en ${place.city.name} | La Guía de Chile`,
    description,
    openGraph: { title: place.title, description, images: [place.image] },
  };
}

const SCHEMA_TYPE: Record<IPlace["type"], string> = {
  ATTRACTION: "TouristAttraction",
  PUBLIC_SERVICE: "GovernmentOffice",
  MARKET: "Place",
};

/**
 * JSON-LD del lugar. `JSON.stringify` y luego `<` → `<`: un texto con `</script>` no puede
 * cerrar la etiqueta (lgdc-security).
 */
function placeJsonLd(place: IPlace): string {
  const data = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[place.type],
    name: place.title,
    description: descriptionHtmlToText(place.description).replace(/\s+/g, " ").trim().slice(0, 300),
    image: [place.image, ...place.gallery].filter((src) => /^https?:\/\//.test(src)),
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: place.commune ?? place.city.name,
      addressRegion: place.city.name,
      addressCountry: "CL",
    },
    ...(place.phone ? { telephone: place.phone } : {}),
    ...(place.website ? { url: place.website } : {}),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Lugar - Detalle público (CLGDC-207, alternativa B)
 *
 * Hero con datos rápidos, galería, descripción y cómo llegar; al lado, los números de emergencia
 * (servicio público), el horario o los días de feria y el contacto; al final, comercios y servicios
 * de la misma ciudad. 404 si no existe.
 */
export default async function LugarPage({ params }: LugarPageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const nearby = await getListingsByCity(place.city.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: placeJsonLd(place) }} />
      <LDCDetailTemplate
        kind="lugar"
        place={place}
        related={nearby.slice(0, 4)}
        relatedTotal={nearby.length}
        today={chileWeekdayIndex()}
      />
    </>
  );
}
