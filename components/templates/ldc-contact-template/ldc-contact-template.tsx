import type { ReactNode } from "react";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCContactForm } from "@/components/organisms/ldc-contact-form";
import { LDCContactInfo } from "@/components/molecules/ldc-contact-info";

export interface LDCContactTemplateProps {
  /** Hero de la página, normalmente `LDCListingsPageHero` ya renderizado */
  hero: ReactNode;
}

/**
 * LDCContactTemplate - Estructura de la página «Contacto»
 *
 * Server Component sin datos. Secciones:
 * - Hero: lo pasa la página ya renderizado (el mismo `LDCListingsPageHero`
 *   de los listados), así el ícono Lucide no cruza a un client component
 * - Contenido: dos columnas con el formulario y las redes sociales
 *
 * @example
 * <LDCContactTemplate
 *   hero={<LDCListingsPageHero title="Contacto" breadcrumbs={breadcrumbs} icon={Mail} />}
 * />
 */
export function LDCContactTemplate({ hero }: LDCContactTemplateProps) {
  return (
    <>
      {hero}

      {/* Content Section */}
      <LDCSection paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <LDCContactForm />

          {/* Contact Info */}
          <LDCContactInfo />
        </div>
      </LDCSection>
    </>
  );
}
