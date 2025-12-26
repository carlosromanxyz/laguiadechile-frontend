import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCWeatherWidget } from "@/components/molecules/ldc-weather-widget";
import { LDCPharmacyBanner } from "@/components/molecules/ldc-pharmacy-banner";
import { getAllCitiesFromRegions, getCityBySlugFromRegions } from "@/services/regions";
import { getListingsByCity } from "@/services/featured-listings";
import { getPropertiesByCity } from "@/services/properties";
import { getClassifiedsByCity } from "@/services/classifieds";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { MapPin, Store, Home, Megaphone } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all cities from all regions
 */
export async function generateStaticParams() {
  const cities = getAllCitiesFromRegions();
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

/**
 * Generate metadata for the city page
 */
export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getCityBySlugFromRegions(slug);

  if (!result) {
    return {
      title: "Ciudad no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${result.city.name} - La Guía de Chile`,
    description: `Descubre comercios, servicios, propiedades y avisos en ${result.city.name}, Chile.`,
  };
}

/**
 * City Page - La Guía de Chile
 *
 * Displays all content in a specific city organized by type:
 * - Comercios & Servicios (listings)
 * - Propiedades (properties)
 * - Avisos (classifieds)
 *
 * Server Component that fetches all city data.
 */
export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const result = getCityBySlugFromRegions(slug);

  if (!result) {
    notFound();
  }

  const { city, region } = result;

  const listings = getListingsByCity(slug);
  const properties = getPropertiesByCity(slug);
  const classifieds = getClassifiedsByCity(slug);

  const totalCount = listings.length + properties.length + classifieds.length;

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Regiones", href: "/regiones" },
    { label: region.name, href: `/region/${region.slug}` },
    { label: city.name, href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title={city.name}
        breadcrumbs={breadcrumbs}
        icon={MapPin}
        rightContent={<LDCWeatherWidget cityName={city.name} />}
      />

      {/* Main Content */}
      <main>
        {/* Pharmacy Banner */}
        <LDCSection paddingY="sm">
          <LDCPharmacyBanner cityName={city.name} />
        </LDCSection>

        {/* Comercios & Servicios Section */}
        {listings.length > 0 && (
          <LDCSection paddingY="md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink/10 dark:bg-pink/20 flex items-center justify-center">
                  <Store className="w-5 h-5 text-pink" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-mulish text-foreground">
                    Comercios y Servicios
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {listings.length} {listings.length === 1 ? "publicación" : "publicaciones"} en {city.name}
                  </p>
                </div>
              </div>
              <Link
                href={`/comercios?ciudad=${slug}`}
                className="text-sm text-pink dark:text-yellow hover:underline hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {listings.slice(0, 10).map((listing) => (
                <LDCListingCard
                  key={listing.id}
                  title={listing.title}
                  slug={listing.slug}
                  type={listing.type}
                  category={listing.category}
                  city={listing.city}
                  image={listing.image}
                  featured={listing.featured}
                  createdAt={listing.createdAt}
                  updatedAt={listing.updatedAt}
                />
              ))}
            </div>

            {listings.length > 10 && (
              <div className="mt-6 text-center sm:hidden">
                <Link
                  href={`/comercios?ciudad=${slug}`}
                  className="text-sm text-pink dark:text-yellow hover:underline"
                >
                  Ver los {listings.length} comercios y servicios →
                </Link>
              </div>
            )}
          </LDCSection>
        )}

        {/* Propiedades Section */}
        {properties.length > 0 && (
          <LDCSection paddingY="md" className="bg-muted/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple/10 dark:bg-purple/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-mulish text-foreground">
                    Propiedades
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {properties.length} {properties.length === 1 ? "propiedad" : "propiedades"} en {city.name}
                  </p>
                </div>
              </div>
              <Link
                href={`/propiedades?ciudad=${slug}`}
                className="text-sm text-pink dark:text-yellow hover:underline hidden sm:block"
              >
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
              {properties.slice(0, 10).map((property) => (
                <LDCPropertyCard
                  key={property.id}
                  title={property.title}
                  slug={property.slug}
                  type={property.type}
                  operation={property.operation}
                  price={property.price}
                  features={property.features}
                  location={property.location}
                  image={property.image}
                  images={property.images}
                  featured={property.featured}
                  isNew={property.isNew}
                />
              ))}
            </div>

            {properties.length > 10 && (
              <div className="mt-6 text-center sm:hidden">
                <Link
                  href={`/propiedades?ciudad=${slug}`}
                  className="text-sm text-pink dark:text-yellow hover:underline"
                >
                  Ver las {properties.length} propiedades →
                </Link>
              </div>
            )}
          </LDCSection>
        )}

        {/* Avisos Section */}
        {classifieds.length > 0 && (
          <LDCSection paddingY="md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange/10 dark:bg-orange/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-mulish text-foreground">
                    Avisos Clasificados
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {classifieds.length} {classifieds.length === 1 ? "aviso" : "avisos"} en {city.name}
                  </p>
                </div>
              </div>
              <Link
                href={`/avisos?ciudad=${slug}`}
                className="text-sm text-pink dark:text-yellow hover:underline hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <div className="space-y-4">
              {classifieds.slice(0, 6).map((classified) => (
                <LDCClassifiedCard
                  key={classified.id}
                  title={classified.title}
                  slug={classified.slug}
                  type={classified.type}
                  category={classified.category}
                  city={classified.city}
                  commune={classified.commune}
                  image={classified.image}
                  price={classified.price}
                  featured={classified.featured}
                  createdAt={classified.createdAt}
                />
              ))}
            </div>

            {classifieds.length > 6 && (
              <div className="mt-6 text-center sm:hidden">
                <Link
                  href={`/avisos?ciudad=${slug}`}
                  className="text-sm text-pink dark:text-yellow hover:underline"
                >
                  Ver los {classifieds.length} avisos →
                </Link>
              </div>
            )}
          </LDCSection>
        )}

        {/* Empty State */}
        {totalCount === 0 && (
          <LDCSection paddingY="lg">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
                No hay publicaciones en {city.name}
              </h3>
              <p className="text-muted-foreground max-w-md">
                Aún no hay comercios, servicios, propiedades ni avisos publicados en esta ciudad.
                ¡Sé el primero en publicar!
              </p>
              <LDCCTAButton
                text="Publicar ahora"
                href="/publicar"
                className="mt-6"
              />
            </div>
          </LDCSection>
        )}
      </main>
    </>
  );
}
