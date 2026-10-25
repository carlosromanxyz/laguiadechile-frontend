import { LDCAboutTemplate } from "@/components/templates/ldc-about-template";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros - La Guía de Chile",
  description: "Conoce más sobre La Guía de Chile, la plataforma que te permite promocionar tu comercio y servicio, o encontrar lo que necesitas.",
};

export default function NosotrosPage() {
  return <LDCAboutTemplate />;
}
