import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCContactForm } from "@/components/organisms/ldc-contact-form";
import { LDCContactInfo } from "@/components/molecules/ldc-contact-info";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { Mail } from "lucide-react";

const breadcrumbs = [
  { label: "Inicio", href: "/" },
  { label: "Contacto", href: "" },
];

/**
 * LDCContactTemplate - Estructura de la página «Contacto»
 *
 * Server Component sin datos. Secciones:
 * - Hero: encabezado con migas de pan
 * - Contenido: dos columnas con el formulario y las redes sociales
 *
 * @example
 * <LDCContactTemplate />
 */
export function LDCContactTemplate() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink/5 via-purple/5 to-yellow/5 dark:from-pink/10 dark:via-purple/10 dark:to-yellow/10 border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16">
          {/* Breadcrumbs */}
          <LDCBreadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-pink/10 dark:bg-purple/20 flex items-center justify-center">
              <Mail className="w-7 h-7 text-pink dark:text-purple" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-mulish text-foreground">
                Contacto
              </h1>
              <p className="text-muted-foreground mt-1">
                Estamos aquí para ayudarte
              </p>
            </div>
          </div>
        </div>
      </section>

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
