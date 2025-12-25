import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedNewsGrid } from "@/components/organisms/ldc-paginated-news-grid";
import { getNews } from "@/services/news";
import { Newspaper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noticias - La Guía de Chile",
  description:
    "Mantente informado con las últimas noticias de Chile. Economía, cultura, tecnología, deportes y más.",
};

/**
 * Noticias Page - La Guía de Chile
 *
 * Displays all news articles with hero and paginated grid layout.
 * Server Component that passes data to client-side paginated grid.
 *
 * Sections:
 * - Hero: Page header with breadcrumbs and title
 * - Grid: Responsive paginated grid of news cards with "Load More"
 */
export default function NoticiasPage() {
  const news = getNews();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Noticias", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Noticias"
        subtitle="Mantente informado con las últimas noticias de Chile. Economía, cultura, tecnología, deportes y más."
        breadcrumbs={breadcrumbs}
        icon={Newspaper}
        count={news.length}
      />

      {/* News Grid */}
      <main>
        <LDCPaginatedNewsGrid
          articles={news}
          itemsPerPage={12}
          columns={4}
          emptyMessage="No se encontraron noticias"
          loadMoreLabel="Cargar más noticias"
        />
      </main>
    </>
  );
}
