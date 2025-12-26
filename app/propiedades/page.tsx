import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedPropertiesGrid } from "@/components/organisms/ldc-paginated-properties-grid";
import { getProperties } from "@/services/properties";
import { Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades - La Guía de Chile",
  description:
    "Encuentra propiedades en Chile. Casas, departamentos, terrenos, oficinas y locales comerciales en venta y arriendo.",
};

/**
 * Propiedades Page - La Guía de Chile
 *
 * Displays all property listings with hero and paginated 5-column grid.
 * Server Component that passes data to client-side paginated grid.
 *
 * Sections:
 * - Hero: Page header with breadcrumbs and title
 * - Grid: Responsive 5-column grid of property cards with "Load More"
 */
export default function PropiedadesPage() {
  const properties = getProperties();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Propiedades"
        breadcrumbs={breadcrumbs}
        icon={Home}
      />

      {/* Properties Grid */}
      <main>
        <LDCPaginatedPropertiesGrid
          properties={properties}
          itemsPerPage={20}
          emptyMessage="No se encontraron propiedades"
          loadMoreLabel="Cargar más propiedades"
        />
      </main>
    </>
  );
}
