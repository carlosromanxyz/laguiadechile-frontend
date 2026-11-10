import Image from "next/image";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCMetricView } from "@/components/atoms/ldc-metric-view";
import { LDCPriceBox } from "@/components/molecules/ldc-price-box";
import { LDCListingGallery } from "@/components/molecules/ldc-listing-gallery";
import { LDCListingMap } from "@/components/molecules/ldc-listing-map";
import { LDCListingSocialMedia } from "@/components/molecules/ldc-listing-social-media";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCClassifiedSeller } from "@/components/molecules/ldc-classified-seller";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCPropertyFeatures } from "@/components/molecules/ldc-property-features";
import { LDCPropertyAgent } from "@/components/molecules/ldc-property-agent";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { LDCNewsAuthor } from "@/components/molecules/ldc-news-author";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
import { LDCListingDetailHero } from "@/components/organisms/ldc-listing-detail-hero";
import { LDCListingInfo } from "@/components/organisms/ldc-listing-info";
import { LDCClassifiedDetailHero } from "@/components/organisms/ldc-classified-detail-hero";
import { LDCPropertyDetailHero } from "@/components/organisms/ldc-property-detail-hero";
import { LDCNewsArticleHero } from "@/components/organisms/ldc-news-article-hero";
import { LDCRelatedSection } from "@/components/organisms/ldc-related-section";
// Eventos (CLGDC-139)
import { LDCEventCard } from "@/components/molecules/ldc-event-card";
import { LDCEventOrganizer } from "@/components/molecules/ldc-event-organizer";
import { LDCEventDetailHero } from "@/components/organisms/ldc-event-detail-hero";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCTimeSwitch } from "@/components/atoms/ldc-time-switch";
import { formatEventLongDay, formatEventPrice } from "@/lib/format/events";
import type { IEvent, IEvents } from "@/interfaces/event";
// Lugares (CLGDC-207)
import Link from "next/link";
import { LDCWeekDays } from "@/components/atoms/ldc-week-days";
import { LDCEmergencyNumbers } from "@/components/molecules/ldc-emergency-numbers";
import { LDCPlaceContact } from "@/components/molecules/ldc-place-contact";
import { LDCScheduleList } from "@/components/molecules/ldc-schedule-list";
import { LDCPlaceDetailHero } from "@/components/organisms/ldc-place-detail-hero";
import type { IPlace } from "@/interfaces/place";
import {
  PLACE_TYPE_META,
  directionsHref,
  formatScheduleSummary,
  hasOpenDays,
} from "@/lib/format/places";
import { PLACE_ACTION_CLASS } from "@/lib/ui/places";
import {
  typeLabels,
  formatClassifiedPrice,
  getRelativeTime,
} from "@/lib/format/classifieds";
import {
  formatPropertyPriceWithPeriod,
  formatCommonExpenses,
  getPropertyTypeLabel,
  getOperationLabel,
} from "@/lib/format/properties";
import { getReadingTime, isNewArticle } from "@/lib/format/news";
import { FileText, Clock, CalendarDays, Ticket, Navigation } from "lucide-react";
import type { ReactNode } from "react";
import type { IListingDetail, IListingDetails } from "@/interfaces/listing";
import type { IClassified, IClassifieds } from "@/interfaces/classified";
import type { IProperty, IProperties } from "@/interfaces/property";
import type { INews, INewsList } from "@/interfaces/news";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";

type LDCDetailTemplateProps =
  | {
      /** Ficha de comercio o de servicio (mismo layout, cambian textos y rutas) */
      kind: "comercio" | "servicio";
      listing: IListingDetail;
      related: IListingDetails;
    }
  | { kind: "aviso"; classified: IClassified; related: IClassifieds }
  | { kind: "propiedad"; property: IProperty; related: IProperties }
  | { kind: "noticia"; news: INews; related: INewsList }
  | {
      kind: "evento";
      event: IEvent;
      related: IEvents;
      /** Ya terminó al renderizar en el servidor; en el navegador lo recalcula `LDCTimeSwitch` */
      past: boolean;
    }
  | {
      kind: "lugar";
      place: IPlace;
      /** «Cerca de este lugar»: comercios y servicios de la misma ciudad (hasta 4) */
      related: IListingDetails;
      /** Cuántos comercios y servicios hay en la ciudad (para «Ver los N de …») */
      relatedTotal: number;
      /** Día de hoy en Chile (0 = lunes) al renderizar; el navegador lo recalcula */
      today: number;
    };

/** Textos y rutas que distinguen la ficha de comercio de la de servicio. */
const LISTING_COPY = {
  comercio: {
    section: "Comercios",
    href: "/comercios",
    relatedTitle: "Comercios Relacionados",
  },
  servicio: {
    section: "Servicios",
    href: "/servicios",
    relatedTitle: "Servicios Relacionados",
  },
} as const;

/**
 * LDCDetailTemplate - Esqueleto de las fichas de detalle.
 *
 * Hero, columna principal (2/3), sidebar (1/3) y, si hay resultados, la
 * sección de relacionados. Cada `kind` decide qué va en cada zona; la página
 * solo pide los datos y le pasa la entidad y sus relacionados.
 *
 * @example
 * ```tsx
 * <LDCDetailTemplate kind="aviso" classified={classified} related={related} />
 * ```
 */
export function LDCDetailTemplate(props: LDCDetailTemplateProps) {
  switch (props.kind) {
    case "comercio":
    case "servicio":
      return <ListingDetail {...props} />;
    case "aviso":
      return <ClassifiedDetail {...props} />;
    case "propiedad":
      return <PropertyDetail {...props} />;
    case "noticia":
      return <NewsDetail {...props} />;
    case "evento":
      return <EventDetail {...props} />;
    case "lugar":
      return <PlaceDetail {...props} />;
  }
}

/** Layout común: hero, grilla 2/3 + 1/3 y sección de relacionados. */
function DetailLayout({
  hero,
  main,
  sidebar,
  related,
}: {
  hero: ReactNode;
  main: ReactNode;
  sidebar: ReactNode;
  related?: ReactNode;
}) {
  return (
    <>
      {hero}

      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">{main}</div>
            <div className="space-y-6">{sidebar}</div>
          </div>
        </LDCSection>

        {related}
      </main>
    </>
  );
}

/** Panel «Descripción» de la columna principal. */
function DescriptionPanel({ children }: { children: ReactNode }) {
  return (
    <LDCPanel padding="lg">
      <h2 className="text-xl font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-pink" />
        Descripción
      </h2>
      {children}
    </LDCPanel>
  );
}

function ListingDetail({
  kind,
  listing,
  related,
}: Extract<LDCDetailTemplateProps, { kind: "comercio" | "servicio" }>) {
  const copy = LISTING_COPY[kind];
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: copy.section, href: copy.href },
    {
      label: listing.category.name,
      href: `${copy.href}?categoria=${listing.category.slug}`,
    },
    { label: listing.title, href: "" },
  ];

  return (
    <DetailLayout
      hero={<LDCListingDetailHero listing={listing} breadcrumbs={breadcrumbs} />}
      main={
        <>
          <DescriptionPanel>
            <div
              className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert
                prose-p:mb-4 prose-p:last:mb-0 text-justify"
              dangerouslySetInnerHTML={{ __html: listing.description }}
            />
          </DescriptionPanel>

          <LDCListingMap
            address={listing.address || "Av. Providencia 1234, Providencia"}
            city={listing.city.name}
          />

          {listing.gallery.length > 0 && (
            <LDCListingGallery images={listing.gallery} title={listing.title} />
          )}
        </>
      }
      sidebar={
        <>
          <LDCMetricView listingId={listing.id} />
          <LDCListingInfo
            listingId={listing.id}
            listingTitle={listing.title}
            contact={listing.contact}
            schedule={listing.schedule}
          />
          <LDCListingSocialMedia socialMedia={listing.socialMedia} />
        </>
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection title={copy.relatedTitle}>
            {related.map((item) => (
              <LDCListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                type={item.type}
                category={item.category}
                city={item.city}
                image={item.image}
                featured={item.featured}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}

function ClassifiedDetail({
  classified,
  related,
}: Extract<LDCDetailTemplateProps, { kind: "aviso" }>) {
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Avisos", href: "/avisos" },
    {
      label: classified.category.name,
      href: `/avisos?categoria=${classified.category.slug}`,
    },
    { label: classified.title, href: "" },
  ];

  const galleryImages = [classified.image, ...classified.gallery];

  return (
    <DetailLayout
      hero={
        <LDCClassifiedDetailHero
          classified={classified}
          breadcrumbs={breadcrumbs}
        />
      }
      main={
        <>
          <LDCListingGallery images={galleryImages} title={classified.title} />

          <DescriptionPanel>
            <p className="text-muted-foreground text-justify whitespace-pre-line">
              {classified.description}
            </p>
          </DescriptionPanel>
        </>
      }
      sidebar={
        <>
          <LDCPriceBox
            label={typeLabels[classified.type] ?? "Precio"}
            price={formatClassifiedPrice(classified.price)}
            metaIcon={<Clock className="w-4 h-4" />}
            meta={
              <>Publicado {getRelativeTime(classified.createdAt).toLowerCase()}</>
            }
          />

          <LDCClassifiedSeller
            seller={classified.seller}
            classifiedTitle={classified.title}
          />
        </>
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection title="Avisos Relacionados" layout="list">
            {related.map((item) => (
              <LDCClassifiedCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                type={item.type}
                category={item.category}
                city={item.city}
                commune={item.commune}
                image={item.image}
                price={item.price}
                featured={item.featured}
                createdAt={item.createdAt}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}

function PropertyDetail({
  property,
  related,
}: Extract<LDCDetailTemplateProps, { kind: "propiedad" }>) {
  const { location, price } = property;

  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: "/propiedades" },
    {
      label: getPropertyTypeLabel(property.type),
      href: `/propiedades?tipo=${property.type}`,
    },
    { label: property.title, href: "" },
  ];

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
    <DetailLayout
      hero={<LDCPropertyDetailHero property={property} breadcrumbs={breadcrumbs} />}
      main={
        <>
          <LDCListingGallery images={galleryImages} title={property.title} />

          <LDCPropertyFeatures type={property.type} features={property.features} />

          <DescriptionPanel>
            <p className="text-muted-foreground text-justify whitespace-pre-line">
              {property.description}
            </p>
          </DescriptionPanel>

          <LDCListingMap address={mapAddress} city={location.city.name} />
        </>
      }
      sidebar={
        <>
          <LDCPriceBox
            label={
              <>
                {getPropertyTypeLabel(property.type)} en{" "}
                {getOperationLabel(property.operation).toLowerCase()}
              </>
            }
            price={formatPropertyPriceWithPeriod(price)}
            note={commonExpenses}
            metaIcon={<CalendarDays className="w-4 h-4" />}
            meta={<>Publicado el {publishedDate}</>}
          />

          <LDCPropertyAgent agent={property.agent} propertyTitle={property.title} />
        </>
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection title="Propiedades Similares">
            {related.map((item) => (
              <LDCPropertyCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                type={item.type}
                operation={item.operation}
                price={item.price}
                features={item.features}
                location={item.location}
                image={item.image}
                images={item.images}
                featured={item.featured}
                isNew={item.isNew}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}

function NewsDetail({
  news,
  related,
}: Extract<LDCDetailTemplateProps, { kind: "noticia" }>) {
  const readingTime = getReadingTime(news.content);

  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Noticias", href: "/noticias" },
    {
      label: news.category.name,
      href: `/noticias?categoria=${news.category.slug}`,
    },
    { label: news.title, href: "" },
  ];

  return (
    <DetailLayout
      hero={
        <LDCNewsArticleHero
          news={news}
          breadcrumbs={breadcrumbs}
          isNew={isNewArticle(news.createdAt)}
          readingTime={readingTime}
        />
      }
      main={
        <>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
              quality={85}
            />
          </div>

          <article
            className="prose prose-base max-w-none text-muted-foreground dark:prose-invert
              prose-headings:font-mulish prose-headings:text-foreground
              prose-p:mb-4 prose-p:last:mb-0 prose-p:leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </>
      }
      sidebar={
        <LDCNewsAuthor
          author={news.author}
          createdAt={news.createdAt}
          readingTime={readingTime}
        />
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection title="Noticias Relacionadas" layout="grid-4">
            {related.map((item) => (
              <LDCNewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                excerpt={item.excerpt}
                category={item.category}
                author={item.author}
                image={item.image}
                featured={item.featured}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}

// ---- Evento (CLGDC-139) ----
function EventDetail({ event, related, past }: Extract<LDCDetailTemplateProps, { kind: "evento" }>) {
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Eventos", href: "/eventos" },
    ...(event.category
      ? [{ label: event.category.name, href: `/eventos?categoria=${event.category.slug}` }]
      : []),
    { label: event.title, href: "" },
  ];

  const mapAddress = [event.address ?? event.venueName, event.commune].filter(Boolean).join(", ");

  return (
    <DetailLayout
      hero={<LDCEventDetailHero event={event} breadcrumbs={breadcrumbs} past={past} />}
      main={
        <>
          <LDCListingGallery images={[event.image, ...event.gallery]} title={event.title} />

          <DescriptionPanel>
            <div
              className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert
                prose-p:mb-4 prose-p:last:mb-0 text-justify"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </DescriptionPanel>

          <LDCListingMap address={mapAddress} city={event.city.name} />
        </>
      }
      sidebar={
        <>
          <LDCPriceBox
            label="Entrada"
            price={formatEventPrice(event.priceType, event.priceAmount)}
            note={
              event.ticketUrl ? (
                // Se quita cuando el evento termina, con la hora del navegador (no la de la caché ISR).
                <LDCTimeSwitch
                  at={event.endsAt ?? event.startsAt}
                  serverPassed={past}
                  before={
                    <LDCCTAButton
                      href={event.ticketUrl}
                      external
                      text={event.priceType === "PAID" ? "Comprar entradas" : "Inscribirme"}
                      icon={<Ticket className="size-4" aria-hidden />}
                      className="mt-3 w-full justify-center"
                    />
                  }
                />
              ) : undefined
            }
            metaIcon={<CalendarDays className="w-4 h-4" aria-hidden />}
            meta={<span className="first-letter:uppercase">{formatEventLongDay(event.startsAt)}</span>}
          />

          <LDCEventOrganizer organizer={event.organizer} eventTitle={event.title} />
        </>
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection title="Otros eventos">
            {related.map((item) => (
              <LDCEventCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                startsAt={item.startsAt}
                endsAt={item.endsAt}
                venueName={item.venueName}
                city={item.city}
                category={item.category}
                image={item.image}
                priceType={item.priceType}
                priceAmount={item.priceAmount}
                featured={item.featured}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}

// ---- Lugar (CLGDC-207, alternativa B) ----
function PlaceDetail({ place, related, relatedTotal, today }: Extract<LDCDetailTemplateProps, { kind: "lugar" }>) {
  const meta = PLACE_TYPE_META[place.type];
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Lugares", href: "/lugares" },
    { label: meta.plural, href: `/lugares?tipo=${meta.query}` },
    { label: place.title, href: "" },
  ];
  const isMarket = place.type === "MARKET";
  const mapAddress = [place.address, place.commune !== place.city.name ? place.commune : undefined]
    .filter(Boolean)
    .join(", ");

  return (
    <DetailLayout
      hero={<LDCPlaceDetailHero place={place} breadcrumbs={breadcrumbs} today={today} />}
      main={
        <>
          <LDCListingGallery images={[place.image, ...place.gallery]} title={place.title} />

          <DescriptionPanel>
            <div
              className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert
                prose-p:mb-4 prose-p:last:mb-0"
              dangerouslySetInnerHTML={{ __html: place.description }}
            />
          </DescriptionPanel>

          <LDCListingMap
            title="Cómo llegar"
            address={mapAddress}
            city={place.city.name}
            action={
              <a
                href={directionsHref(mapAddress, place.city.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cómo llegar a ${place.title} en Google Maps (se abre en otra pestaña)`}
                className={PLACE_ACTION_CLASS}
              >
                <Navigation aria-hidden />
                Cómo llegar
              </a>
            }
          />
        </>
      }
      sidebar={
        <>
          {place.type === "PUBLIC_SERVICE" && <LDCEmergencyNumbers own={place.emergencyNumber} />}

          {place.schedule && hasOpenDays(place.schedule) && (
            <LDCPanel>
              <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink" aria-hidden />
                {isMarket ? "Días de feria" : "Horario"}
              </h3>
              {isMarket && (
                <>
                  <LDCWeekDays schedule={place.schedule} serverToday={today} size="lg" className="mb-4" />
                  <p className="mb-3 flex items-start gap-2 font-extrabold text-foreground">
                    <CalendarDays className="mt-1 size-4 shrink-0 text-place-market" aria-hidden />
                    <span>{formatScheduleSummary(place.schedule)}</span>
                  </p>
                </>
              )}
              <LDCScheduleList schedule={place.schedule} serverToday={today} />
            </LDCPanel>
          )}

          <LDCPlaceContact place={place} />
        </>
      }
      related={
        related.length > 0 && (
          <LDCRelatedSection
            title="Cerca de este lugar"
            description={`Comercios y servicios de ${place.city.name}`}
            action={
              <Link
                href={`/ciudad/${place.city.slug}`}
                className="inline-flex min-h-11 items-center text-sm text-pink-strong hover:underline dark:text-yellow"
              >
                Ver los {relatedTotal} de {place.city.name} →
              </Link>
            }
          >
            {related.map((item) => (
              <LDCListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                type={item.type}
                category={item.category}
                city={item.city}
                image={item.image}
                featured={item.featured}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
              />
            ))}
          </LDCRelatedSection>
        )
      }
    />
  );
}
