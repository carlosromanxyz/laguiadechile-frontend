import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { getCategoryBySlug, getAllCategories } from "@/services/featured-categories";
import { getListingsByCategory } from "@/services/featured-listings";
import { Tag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

/**
 * Generate metadata for the category page
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${category.name} - La Guía de Chile`,
    description: category.description,
  };
}

/**
 * Category Page - La Guía de Chile
 *
 * Displays all listings in a specific category with hero and paginated grid layout.
 * Server Component that fetches category data and passes to client-side grid.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const listings = getListingsByCategory(slug);

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Categorías", href: "/" },
    { label: category.name, href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title={category.name}
        subtitle={category.description}
        breadcrumbs={breadcrumbs}
        icon={Tag}
        count={listings.length}
      />

      {/* Listings Grid */}
      <main>
        <LDCPaginatedListingsGrid
          listings={listings}
          itemsPerPage={20}
          columns={5}
          emptyMessage={`No se encontraron publicaciones en ${category.name}`}
          loadMoreLabel="Cargar más publicaciones"
        />
      </main>
    </>
  );
}
