import { LDCContactTemplate } from "@/components/templates/ldc-contact-template";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - La Guía de Chile",
  description:
    "Contáctanos para cualquier consulta sobre La Guía de Chile. Estamos aquí para ayudarte.",
};

export default function ContactoPage() {
  return <LDCContactTemplate />;
}
