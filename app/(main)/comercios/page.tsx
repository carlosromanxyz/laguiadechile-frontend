import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { getCommerces } from "@/services/commerces";
import { Store } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comercios - La Guía de Chile",
  description:
    "Descubre los mejores comercios de Chile. Restaurantes, tiendas, hoteles y más negocios cerca de ti.",
};

/**
 * Comercios Page - La Guía de Chile
 *
 * Displays all commerce listings with hero and paginated grid layout.
 * Server Component that passes data to client-side paginated grid.
 *
 * Sections:
 * - Hero: Page header with breadcrumbs and title
 * - Grid: Responsive paginated grid of commerce cards with "Load More"
 */
export default function ComerciosPage() {
  const commerces = getCommerces();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Comercios", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Comercios"
        breadcrumbs={breadcrumbs}
        icon={Store}
      />

      {/* Listings Grid */}
      <main>
        <LDCPaginatedListingsGrid
          listings={commerces}
          itemsPerPage={20}
          columns={5}
          emptyMessage="No se encontraron comercios"
          loadMoreLabel="Cargar más comercios"
        />
      </main>
    </>
  );
}
