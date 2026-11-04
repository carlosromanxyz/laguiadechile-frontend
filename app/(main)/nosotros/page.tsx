import { LDCAboutTemplate } from "@/components/templates/ldc-about-template";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros - La Guía de Chile",
  description: "Qué es La Guía de Chile: comercios, servicios, avisos, propiedades y noticias por ciudad y región. Si tienes un negocio, publica tu ficha en el sitio.",
};

export default function NosotrosPage() {
  return <LDCAboutTemplate />;
}
