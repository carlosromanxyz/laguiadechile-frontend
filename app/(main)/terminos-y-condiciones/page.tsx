import { LDCLegalTemplate } from "@/components/templates/ldc-legal-template";
import { TERMS } from "@/content/legal/terminos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones - La Guía de Chile",
  description:
    "Términos y condiciones de uso de La Guía de Chile: cuentas, publicaciones, moderación y responsabilidades al usar el sitio.",
  ...(TERMS.draft && { robots: { index: false, follow: true } }),
};

/** Términos y condiciones: el texto vive en `content/legal/terminos.ts`. */
export default function TerminosYCondicionesPage() {
  return <LDCLegalTemplate document={TERMS} href="/terminos-y-condiciones" />;
}
