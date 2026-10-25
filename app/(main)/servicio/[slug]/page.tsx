import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import {
  getListingBySlugAndType,
  getRelatedListings,
  getServicioSlugs,
} from "@/services/listings";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ServicioPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all servicios
 */
export async function generateStaticParams() {
  return getServicioSlugs();
}

/**
 * Generate metadata for the servicio page
 */
export async function generateMetadata({
  params,
}: ServicioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlugAndType(slug, "servicio");

  if (!listing) {
    return {
      title: "Servicio no encontrado - La Guía de Chile",
    };
  }

  // Strip HTML tags from description for meta
  const plainDescription = listing.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  return {
    title: `${listing.title} - ${listing.category.name} en ${listing.city.name} | La Guía de Chile`,
    description: plainDescription,
    openGraph: {
      title: listing.title,
      description: plainDescription,
      images: [listing.image],
    },
  };
}

/**
 * Servicio Detail Page - La Guía de Chile
 *
 * Displays detailed information about a service:
 * - Hero with featured image
 * - Description
 * - Contact information
 * - Schedule
 * - Gallery
 * - Related listings
 */
export default async function ServicioPage({ params }: ServicioPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlugAndType(slug, "servicio");

  if (!listing) {
    notFound();
  }

  const relatedListings = await getRelatedListings(
    listing.id,
    listing.category.id,
    listing.city.id,
    4
  );

  return (
    <LDCDetailTemplate
      kind="servicio"
      listing={listing}
      related={relatedListings}
    />
  );
}
