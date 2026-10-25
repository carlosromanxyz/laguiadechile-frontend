import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import {
  getListingBySlugAndType,
  getRelatedListings,
  getComercioSlugs,
} from "@/services/listings";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ComercioPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all comercios
 */
export async function generateStaticParams() {
  return getComercioSlugs();
}

/**
 * Generate metadata for the comercio page
 */
export async function generateMetadata({
  params,
}: ComercioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlugAndType(slug, "comercio");

  if (!listing) {
    return {
      title: "Comercio no encontrado - La Guía de Chile",
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
 * Comercio Detail Page - La Guía de Chile
 *
 * Displays detailed information about a business:
 * - Hero with featured image
 * - Description
 * - Contact information
 * - Schedule
 * - Gallery
 * - Related listings
 */
export default async function ComercioPage({ params }: ComercioPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlugAndType(slug, "comercio");

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
      kind="comercio"
      listing={listing}
      related={relatedListings}
    />
  );
}
