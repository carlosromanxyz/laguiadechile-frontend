import { LDCAboutHero } from "@/components/organisms/ldc-about-hero";
import { LDCAboutWhat } from "@/components/organisms/ldc-about-what";
import { LDCAboutWhy } from "@/components/organisms/ldc-about-why";

/**
 * LDCAboutTemplate - Estructura de la página «Nosotros»
 *
 * Server Component sin datos. Secciones:
 * - Hero: título e ilustración a pantalla completa
 * - Qué: qué es La Guía de Chile
 * - Por qué: beneficios y razones para usar la plataforma
 *
 * @example
 * <LDCAboutTemplate />
 */
export function LDCAboutTemplate() {
  return (
    <>
      {/* Hero Section */}
      <LDCAboutHero />

      {/* What Section */}
      <LDCAboutWhat />

      {/* Why Section */}
      <LDCAboutWhy />
    </>
  );
}
