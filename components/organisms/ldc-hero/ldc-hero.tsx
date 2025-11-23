import { LDCHeroText } from "@/components/atoms/ldc-hero-text";
import { LDCScrollIndicator } from "@/components/atoms/ldc-scroll-indicator";
import { LDCHeroSlider } from "@/components/molecules/ldc-hero-slider";
import { LDCSearchForm } from "@/components/molecules/ldc-search-form";
import { getCategories, getCities } from "@/services/search-data";

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
  const categories = getCategories();
  const cities = getCities();

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black">
      {/* Background Image Slider */}
      <LDCHeroSlider />

      {/* Content Container */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Column: Hero Text */}
          <div>
            <LDCHeroText
              text="Te ayudamos a encontrar y descubrir lo que buscas."
              featuredWords={[
                { word: "encontrar", bgColor: "bg-pink", gradientColor: "yellow" },
                { word: "descubrir", bgColor: "bg-purple", gradientColor: "green" },
              ]}
              subText="Encuentra los mejores lugares, comercios, servicios y más en Chile."
            />
          </div>

          {/* Right Column: Search Form */}
          <div className="flex items-center justify-center">
            <div className="w-full">
              <LDCSearchForm categories={categories} cities={cities} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <LDCScrollIndicator />
    </section>
  );
}
