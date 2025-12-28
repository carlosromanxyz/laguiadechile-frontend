import { LDCListingDetailHero } from "@/components/organisms/ldc-listing-detail-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingInfo } from "@/components/molecules/ldc-listing-info";
import { LDCListingGallery } from "@/components/molecules/ldc-listing-gallery";
import { LDCListingMap } from "@/components/molecules/ldc-listing-map";
import { LDCListingSocialMedia } from "@/components/molecules/ldc-listing-social-media";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import {
  getListingBySlugAndType,
  getRelatedListings,
  getComercioSlugs,
} from "@/services/listings";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
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
  const listing = getListingBySlugAndType(slug, "comercio");

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
  const listing = getListingBySlugAndType(slug, "comercio");

  if (!listing) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Comercios", href: "/comercios" },
    { label: listing.category.name, href: `/comercios?categoria=${listing.category.slug}` },
    { label: listing.title, href: "" },
  ];

  const relatedListings = getRelatedListings(
    listing.id,
    listing.category.id,
    listing.city.id,
    4
  );

  return (
    <>
      {/* Hero Section */}
      <LDCListingDetailHero listing={listing} breadcrumbs={breadcrumbs} />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink" />
                  Descripción
                </h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert
                    prose-p:mb-4 prose-p:last:mb-0 text-justify"
                  dangerouslySetInnerHTML={{ __html: listing.description }}
                />
              </div>

              {/* Map */}
              <LDCListingMap
                address={listing.address || "Av. Providencia 1234, Providencia"}
                city={listing.city.name}
              />

              {/* Gallery */}
              {listing.gallery.length > 0 && (
                <LDCListingGallery
                  images={listing.gallery}
                  title={listing.title}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <LDCListingInfo
                listingTitle={listing.title}
                contact={listing.contact}
                schedule={listing.schedule}
              />
              <LDCListingSocialMedia socialMedia={listing.socialMedia} />
            </div>
          </div>
        </LDCSection>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <LDCSection paddingY="md" className="bg-muted/30">
            <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
              Comercios Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.map((related) => (
                <LDCListingCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  type={related.type}
                  category={related.category}
                  city={related.city}
                  image={related.image}
                  featured={related.featured}
                  createdAt={related.createdAt}
                  updatedAt={related.updatedAt}
                />
              ))}
            </div>
          </LDCSection>
        )}
      </main>
    </>
  );
}
