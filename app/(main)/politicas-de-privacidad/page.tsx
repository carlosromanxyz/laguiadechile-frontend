import { LDCLegalTemplate } from "@/components/templates/ldc-legal-template";
import { PRIVACY } from "@/content/legal/privacidad";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad - La Guía de Chile",
  description:
    "Cómo La Guía de Chile trata tus datos personales: qué guarda, para qué los usa, con quién los comparte y cómo ejercer tus derechos.",
  ...(PRIVACY.draft && { robots: { index: false, follow: true } }),
};

/** Políticas de privacidad: el texto vive en `content/legal/privacidad.ts`. */
export default function PoliticasDePrivacidadPage() {
  return <LDCLegalTemplate document={PRIVACY} href="/politicas-de-privacidad" />;
}
