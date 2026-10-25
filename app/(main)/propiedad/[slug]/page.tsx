import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import {
  getPropertyBySlug,
  getPropertySlugs,
  getRelatedProperties,
  getPropertyTypeLabel,
} from "@/services/properties";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PropiedadPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all properties
 */
export async function generateStaticParams() {
  return getPropertySlugs();
}

/**
 * Generate metadata for the propiedad page
 */
export async function generateMetadata({
  params,
}: PropiedadPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Propiedad no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${property.title} - ${getPropertyTypeLabel(property.type)} en ${property.location.commune} | La Guía de Chile`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.image],
    },
  };
}

/**
 * Propiedad (Property) Detail Page - La Guía de Chile
 *
 * Displays detailed information about a real-estate listing:
 * - Hero with operation/type badges
 * - Image gallery
 * - Features (surface, bedrooms, bathrooms, parking)
 * - Description
 * - Approximate location map
 * - Price box + publisher contact (sidebar)
 * - Related properties
 */
export default async function PropiedadPage({ params }: PropiedadPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = await getRelatedProperties(
    property.slug,
    property.location.city.slug,
    property.type,
    4
  );

  return (
    <LDCDetailTemplate
      kind="propiedad"
      property={property}
      related={relatedProperties}
    />
  );
}
