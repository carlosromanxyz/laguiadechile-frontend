import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCContactTemplate } from "@/components/templates/ldc-contact-template";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - La Guía de Chile",
  description:
    "Contáctanos para cualquier consulta sobre La Guía de Chile. Estamos aquí para ayudarte.",
};

export default function ContactoPage() {
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Contacto", href: "" },
  ];

  return (
    <LDCContactTemplate
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
