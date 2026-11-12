import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCImageCredits } from "@/components/molecules/ldc-image-credits";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { getImageCredits } from "@/lib/api/credits";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Términos y condiciones - La Guía de Chile",
  description:
    "Términos de uso de La Guía de Chile y créditos de las fotos de Wikimedia Commons que usa el sitio, con su autor y licencia.",
};

/**
 * Términos y condiciones (CLGDC-210): el texto legal está pendiente; por ahora la página
 * muestra los créditos de las fotos que piden atribución.
 */
export default async function TerminosYCondicionesPage() {
  const credits = await getImageCredits();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Términos y condiciones", href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={<LDCListingsPageHero title="Términos y condiciones" breadcrumbs={breadcrumbs} icon={FileText} />}
    >
      <LDCSection paddingY="lg" containerSize="sm">
        <div className="space-y-8">
          <LDCPanel as="section" padding="lg" aria-labelledby="terminos-de-uso">
            <LDCSectionHeader variant="compact" title="Términos de uso" titleId="terminos-de-uso" className="mb-3" />
            <p className="text-muted-foreground">Este texto se completará pronto.</p>
          </LDCPanel>

          <LDCPanel as="section" padding="lg" aria-labelledby="creditos-de-imagenes">
            <LDCSectionHeader
              variant="compact"
              title="Créditos de imágenes"
              titleId="creditos-de-imagenes"
              className="mb-3"
            />
            <p className="mb-5 text-muted-foreground">
              Algunas fotos del sitio vienen de Wikimedia Commons y se usan según la licencia que eligió cada autor.
            </p>
            <LDCImageCredits credits={credits} />
          </LDCPanel>
        </div>
      </LDCSection>
    </LDCListingPageTemplate>
  );
}
