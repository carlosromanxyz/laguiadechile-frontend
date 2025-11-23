import { LDCHeroText } from "@/components/atoms/ldc-hero-text";
import { LDCScrollIndicator } from "@/components/atoms/ldc-scroll-indicator";
import { LDCHeroSlider } from "@/components/molecules/ldc-hero-slider";

/**
 * LDCHero - Hero Section Component
 *
 * Main hero section for the homepage displaying a full-screen banner
 * with animated background slider, hero text, and search selectors.
 *
 * Features:
 * - Full viewport height
 * - Black background with image slider overlay (30% opacity)
 * - Two-column layout (text left, selectors right)
 * - Responsive layout (stacks on mobile)
 * - Scroll indicator at bottom
 *
 * @example
 * <LDCHero />
 */

export function LDCHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black">
      {/* Background Image Slider */}
      <LDCHeroSlider />

      {/* Content Container */}
      <div className="container relative z-10 px-6 xl:px-0">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Column: Hero Text */}
          <div>
            <LDCHeroText
              text="Te ayudamos a encontrar lo que buscas."
              featuredWord="encontrar"
              subText="Encuentra los mejores lugares, comercios, servicios y más en Chile."
            />
          </div>

          {/* Right Column: Search Selectors */}
          <div className="flex items-center justify-center">
            {/* Selectors will go here */}
            <div className="w-full rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <p className="text-center text-white/60">
                Selectores de búsqueda (próximamente)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <LDCScrollIndicator />
    </section>
  );
}
