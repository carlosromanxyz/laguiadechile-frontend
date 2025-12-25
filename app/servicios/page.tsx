import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { getServices } from "@/services/services";
import { Wrench } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios - La Guía de Chile",
  description:
    "Encuentra los mejores servicios profesionales de Chile. Salud, educación, entretenimiento y más servicios cerca de ti.",
};

/**
 * Servicios Page - La Guía de Chile
 *
 * Displays all service listings with hero and paginated grid layout.
 * Server Component that passes data to client-side paginated grid.
 *
 * Sections:
 * - Hero: Page header with breadcrumbs and title
 * - Grid: Responsive paginated grid of service cards with "Load More"
 */
export default function ServiciosPage() {
  const services = getServices();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Servicios"
        subtitle="Encuentra los mejores servicios profesionales de Chile. Salud, educación, entretenimiento y todo lo que necesitas."
        breadcrumbs={breadcrumbs}
        icon={Wrench}
        count={services.length}
      />

      {/* Listings Grid */}
      <main>
        <LDCPaginatedListingsGrid
          listings={services}
          itemsPerPage={20}
          columns={5}
          emptyMessage="No se encontraron servicios"
          loadMoreLabel="Cargar más servicios"
        />
      </main>
    </>
  );
}
