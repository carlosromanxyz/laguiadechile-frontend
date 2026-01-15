import { LDCAboutHero } from "@/components/organisms/ldc-about-hero";
import { LDCAboutWhat } from "@/components/organisms/ldc-about-what";
import { LDCAboutWhy } from "@/components/organisms/ldc-about-why";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros - La Guía de Chile",
  description: "Conoce más sobre La Guía de Chile, la plataforma que te permite promocionar tu comercio y servicio, o encontrar lo que necesitas.",
};

/**
 * About Page - La Guía de Chile
 *
 * About/Nosotros page explaining what La Guía de Chile is,
 * what it offers, and why users should use it.
 *
 * Server Component (default in Next.js App Router)
 *
 * Sections:
 * - Hero: Full-screen hero with title and illustration
 * - What: Explanation of what La Guía de Chile is
 * - Why: Benefits and reasons to use the platform
 */
export default function NosotrosPage() {
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
