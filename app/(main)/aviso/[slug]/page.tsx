import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import {
  getClassifiedBySlug,
  getClassifiedSlugs,
  getRelatedClassifieds,
} from "@/services/classifieds";
import { notFound } from "next/navigation";
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

  const relatedClassifieds = await getRelatedClassifieds(
    classified.id,
    classified.category.id,
    classified.city.id,
    4
  );

  return (
    <LDCDetailTemplate
      kind="aviso"
      classified={classified}
      related={relatedClassifieds}
    />
  );
}
