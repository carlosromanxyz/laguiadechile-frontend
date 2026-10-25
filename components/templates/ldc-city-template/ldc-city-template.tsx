import type { ReactNode } from "react";
import Link from "next/link";
import { MapPin, Store, Home, Megaphone } from "lucide-react";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import type { IRegion, IRegionCity } from "@/interfaces/region";
import type { IListingDetails } from "@/interfaces/listing";
import type { IProperties } from "@/interfaces/property";
import type { IClassifieds } from "@/interfaces/classified";

interface LDCCityTemplateProps {
  /** Ciudad (nombre y slug) */
  city: Pick<IRegionCity, "name" | "slug">;
  /** Región de la ciudad, para las migas de pan */
  region: Pick<IRegion, "name" | "slug">;
  /** Comercios y servicios de la ciudad */
  listings: IListingDetails;
  /** Propiedades de la ciudad */
  properties: IProperties;
  /** Avisos clasificados de la ciudad */
  classifieds: IClassifieds;
  /** Resumen de Wikipedia: contenedor cliente que va en su sección, entre propiedades y avisos */
  wikipedia: ReactNode;
  /** Clima y farmacia de turno: contenedor cliente que va en la grilla bajo el hero */
  liveInfo: ReactNode;
}

/**
 * LDCCityTemplate - Ficha de ciudad
 *
 * Hero con migas de pan, clima y farmacia de turno (`liveInfo`), y las secciones de comercios
 * y servicios, propiedades, Wikipedia (`wikipedia`) y avisos de la ciudad, o un estado vacío si no hay
 * publicaciones. Sin datos propios: todo llega por props.
 *
 * @example
 * ```tsx
 * <LDCCityTemplate
 *   city={city}
 *   region={region}
 *   listings={listings}
 *   properties={properties}
 *   classifieds={classifieds}
 *   wikipedia={<LDCCityWikipedia cityName={city.name} />}
 *   liveInfo={<LDCCityLiveInfo cityName={city.name} />}
 * />
 * ```
 */
export function LDCCityTemplate({
  city,
  region,
  listings,
  properties,
  classifieds,
  wikipedia,
  liveInfo,
}: LDCCityTemplateProps) {
  const { slug } = city;
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
        rightContent={<LDCSocialShareButtons title={city.name} variant="dark" />}
      />

      {/* Main Content */}
      <main>
        {/* Weather & Pharmacy Banner Row */}
        <LDCSection paddingY="sm">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-4">
            {liveInfo}
          </div>
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

        {/* Wikipedia Section */}
        <LDCSection paddingY="md">
          {wikipedia}
        </LDCSection>

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
