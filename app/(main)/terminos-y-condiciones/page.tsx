import { LDCLegalTemplate } from "@/components/templates/ldc-legal-template";
import { TERMS } from "@/content/legal/terminos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones - La Guía de Chile",
  description:
    "Términos y condiciones de La Guía de Chile: tu cuenta, cómo publicar, la revisión de las publicaciones, el uso de imágenes y la ley aplicable.",
  ...(TERMS.draft && { robots: { index: false, follow: true } }),
};

/** Términos y condiciones: el texto vive en `content/legal/terminos.ts`. */
export default function TerminosYCondicionesPage() {
  return <LDCLegalTemplate document={TERMS} href="/terminos-y-condiciones" />;
}
