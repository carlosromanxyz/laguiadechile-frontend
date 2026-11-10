import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCContactTemplate } from "@/components/templates/ldc-contact-template";
import { contactSubjectFromPreset } from "@/lib/contact/limits";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - La Guía de Chile",
  description:
    "Contáctanos para cualquier consulta sobre La Guía de Chile. Estamos aquí para ayudarte.",
};

interface ContactoPageProps {
  /**
   * `?asunto=<clave>` prellena solo el asunto, desde la lista cerrada `CONTACT_SUBJECT_PRESETS`
   * (CLGDC-206). Leer `searchParams` deja la página dinámica: se acepta, es un formulario liviano.
   */
  searchParams: Promise<{ asunto?: string | string[] }>;
}

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const { asunto } = await searchParams;
  const defaultSubject = contactSubjectFromPreset(asunto);
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Contacto", href: "" },
  ];

  return (
    <LDCContactTemplate
      defaultSubject={defaultSubject}
      hero={
        <LDCListingsPageHero
          title="Contacto"
          breadcrumbs={breadcrumbs}
          icon={Mail}
        />
      }
    />
  );
}
