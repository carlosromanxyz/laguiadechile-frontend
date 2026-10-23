import { LDCClassifiedDetailHero } from "@/components/organisms/ldc-classified-detail-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingGallery } from "@/components/molecules/ldc-listing-gallery";
import { LDCClassifiedSeller } from "@/components/molecules/ldc-classified-seller";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import {
  getClassifiedBySlug,
  getClassifiedSlugs,
  getRelatedClassifieds,
  formatClassifiedPrice,
  getRelativeTime,
} from "@/services/classifieds";
import { notFound } from "next/navigation";
import { FileText, Tag, Clock } from "lucide-react";
import type { Metadata } from "next";

interface AvisoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all classifieds
 */
export async function generateStaticParams() {
  return getClassifiedSlugs();
}

/**
 * Generate metadata for the aviso page
 */
export async function generateMetadata({
  params,
}: AvisoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const classified = await getClassifiedBySlug(slug);

  if (!classified) {
    return {
      title: "Aviso no encontrado - La Guía de Chile",
    };
  }

  return {
    title: `${classified.title} - ${classified.category.name} en ${classified.city.name} | La Guía de Chile`,
    description: classified.description.slice(0, 160),
    openGraph: {
      title: classified.title,
      description: classified.description.slice(0, 160),
      images: [classified.image],
    },
  };
}

const typeLabels: Record<string, string> = {
  vendo: "Vendo",
  compro: "Compro",
  arriendo: "Arriendo",
  busco: "Busco",
  ofrezco: "Ofrezco",
};

/**
 * Aviso (Classified) Detail Page - La Guía de Chile
 *
 * Displays detailed information about a classified ad:
 * - Hero with type/category badges
 * - Image gallery
 * - Description
 * - Price box + seller contact (sidebar)
 * - Related classifieds
 */
export default async function AvisoPage({ params }: AvisoPageProps) {
  const { slug } = await params;
  const classified = await getClassifiedBySlug(slug);

  if (!classified) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Avisos", href: "/avisos" },
    {
      label: classified.category.name,
      href: `/avisos?categoria=${classified.category.slug}`,
    },
    { label: classified.title, href: "" },
  ];

  const relatedClassifieds = await getRelatedClassifieds(
    classified.id,
    classified.category.id,
    classified.city.id,
    4
  );

  const galleryImages = [classified.image, ...classified.gallery];

  return (
    <>
      {/* Hero Section */}
      <LDCClassifiedDetailHero
        classified={classified}
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <LDCListingGallery
                images={galleryImages}
                title={classified.title}
              />

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink" />
                  Descripción
                </h2>
                <p className="text-muted-foreground text-justify whitespace-pre-line">
                  {classified.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price box */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tag className="w-4 h-4 text-pink" />
                  {typeLabels[classified.type] ?? "Precio"}
                </div>
                <p className="text-3xl font-bold font-mulish text-foreground">
                  {formatClassifiedPrice(classified.price)}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
                  <Clock className="w-4 h-4" />
                  <span>Publicado {getRelativeTime(classified.createdAt).toLowerCase()}</span>
                </div>
              </div>

              {/* Seller */}
              <LDCClassifiedSeller
                seller={classified.seller}
                classifiedTitle={classified.title}
              />
            </div>
          </div>
        </LDCSection>

        {/* Related Classifieds */}
        {relatedClassifieds.length > 0 && (
          <LDCSection paddingY="md" className="bg-muted/30">
            <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
              Avisos Relacionados
            </h2>
            <div className="space-y-4">
              {relatedClassifieds.map((related) => (
                <LDCClassifiedCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  type={related.type}
                  category={related.category}
                  city={related.city}
                  commune={related.commune}
                  image={related.image}
                  price={related.price}
                  featured={related.featured}
                  createdAt={related.createdAt}
                />
              ))}
            </div>
          </LDCSection>
        )}
      </main>
    </>
  );
}
