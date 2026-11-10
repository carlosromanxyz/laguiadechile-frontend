import type { ReactNode } from "react";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCContactForm } from "@/components/organisms/ldc-contact-form";
import { LDCContactInfo } from "@/components/molecules/ldc-contact-info";

export interface LDCContactTemplateProps {
  /** Hero de la página, normalmente `LDCListingsPageHero` ya renderizado */
  hero: ReactNode;
  /** Asunto con el que arranca el formulario (de `?asunto=`, ya saneado; CLGDC-206) */
  defaultSubject?: string;
}

/**
 * LDCContactTemplate - Estructura de la página «Contacto»
 *
 * Server Component sin datos. Secciones:
 * - Hero: lo pasa la página ya renderizado (el mismo `LDCListingsPageHero`
 *   de los listados), así el ícono Lucide no cruza a un client component
 * - Contenido: dos columnas con el formulario y las redes sociales. `defaultSubject` llega al
 *   formulario como asunto inicial; va también de `key`, así un asunto nuevo lo reinicia
 *
 * @example
 * <LDCContactTemplate
 *   hero={<LDCListingsPageHero title="Contacto" breadcrumbs={breadcrumbs} icon={Mail} />}
 * />
 */
export function LDCContactTemplate({ hero, defaultSubject }: LDCContactTemplateProps) {
  return (
    <>
      {hero}

      {/* Content Section */}
      <LDCSection paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <LDCContactForm key={defaultSubject ?? ""} defaultSubject={defaultSubject} />

          {/* Contact Info */}
          <LDCContactInfo />
        </div>
      </LDCSection>
    </>
  );
}
