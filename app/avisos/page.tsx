import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedClassifiedsList } from "@/components/organisms/ldc-paginated-classifieds-list";
import { getClassifieds } from "@/services/classifieds";
import { Megaphone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avisos Clasificados - La Guía de Chile",
  description:
    "Encuentra avisos clasificados en Chile. Compra, vende, arrienda y ofrece servicios. Electrónica, vehículos, inmuebles y más.",
};

/**
 * Avisos Page - La Guía de Chile
 *
 * Displays all classified listings with hero and paginated list layout.
 * Server Component that passes data to client-side paginated list.
 *
 * Sections:
 * - Hero: Page header with breadcrumbs and title
 * - List: Paginated list of horizontal classified cards with "Load More"
 */
export default function AvisosPage() {
  const classifieds = getClassifieds();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Avisos Clasificados", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Avisos Clasificados"
        subtitle="Compra, vende, arrienda y encuentra todo lo que necesitas. Miles de avisos actualizados diariamente."
        breadcrumbs={breadcrumbs}
        icon={Megaphone}
        count={classifieds.length}
      />

      {/* Classifieds List */}
      <main>
        <LDCPaginatedClassifiedsList
          classifieds={classifieds}
          itemsPerPage={10}
          emptyMessage="No se encontraron avisos"
          loadMoreLabel="Cargar más avisos"
        />
      </main>
    </>
  );
}
