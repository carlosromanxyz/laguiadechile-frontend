import { LDCPropertyDetailHero } from "@/components/organisms/ldc-property-detail-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingGallery } from "@/components/molecules/ldc-listing-gallery";
import { LDCListingMap } from "@/components/molecules/ldc-listing-map";
import { LDCPropertyFeatures } from "@/components/molecules/ldc-property-features";
import { LDCPropertyAgent } from "@/components/molecules/ldc-property-agent";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import {
  getPropertyBySlug,
  getPropertySlugs,
  getRelatedProperties,
  formatPropertyPriceWithPeriod,
  formatCommonExpenses,
  getPropertyTypeLabel,
  getOperationLabel,
} from "@/services/properties";
import { notFound } from "next/navigation";
import { FileText, Tag, CalendarDays } from "lucide-react";
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

  const { location, price } = property;

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: "/propiedades" },
    {
      label: getPropertyTypeLabel(property.type),
      href: `/propiedades?tipo=${property.type}`,
    },
    { label: property.title, href: "" },
  ];

  const relatedProperties = await getRelatedProperties(
    property.slug,
    location.city.slug,
    property.type,
    4
  );

  const galleryImages = property.images?.length
    ? property.images
    : [property.image];

  const mapAddress = [location.neighborhood, location.commune]
    .filter(Boolean)
    .join(", ");

  const commonExpenses = formatCommonExpenses(price.commonExpenses);
  const publishedDate = new Date(property.createdAt).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Hero Section */}
      <LDCPropertyDetailHero property={property} breadcrumbs={breadcrumbs} />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <LDCListingGallery images={galleryImages} title={property.title} />

              {/* Features */}
              <LDCPropertyFeatures features={property.features} />

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink" />
                  Descripción
                </h2>
                <p className="text-muted-foreground text-justify whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Map */}
              <LDCListingMap address={mapAddress} city={location.city.name} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price box */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tag className="w-4 h-4 text-pink" />
                  {getPropertyTypeLabel(property.type)} en{" "}
                  {getOperationLabel(property.operation).toLowerCase()}
                </div>
                <p className="text-3xl font-bold font-mulish text-foreground">
                  {formatPropertyPriceWithPeriod(price)}
                </p>
                {commonExpenses && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {commonExpenses}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
                  <CalendarDays className="w-4 h-4" />
                  <span>Publicado el {publishedDate}</span>
                </div>
              </div>

              {/* Publisher / agent */}
              <LDCPropertyAgent
                agent={property.agent}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </LDCSection>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <LDCSection paddingY="md" className="bg-muted/30">
            <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
              Propiedades Similares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map((related) => (
                <LDCPropertyCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  type={related.type}
                  operation={related.operation}
                  price={related.price}
                  features={related.features}
                  location={related.location}
                  image={related.image}
                  images={related.images}
                  featured={related.featured}
                  isNew={related.isNew}
                />
              ))}
            </div>
          </LDCSection>
        )}
      </main>
    </>
  );
}
