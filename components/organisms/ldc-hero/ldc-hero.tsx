"use client";

import { LDCHeroText } from "@/components/atoms/ldc-hero-text";
import { LDCScrollIndicator } from "@/components/atoms/ldc-scroll-indicator";
import { LDCHeroSlider } from "@/components/molecules/ldc-hero-slider";
import { LDCSearchForm } from "@/components/molecules/ldc-search-form";
import { getCategories, getCities } from "@/services/search-data";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
 * - Hero text visible only on desktop (lg breakpoint: 1024px+)
 *
 * @example
 * <LDCHero />
 */

export function LDCHero() {
  const categories = getCategories();
  const cities = getCities();
  const isMobile = useIsMobile(1024);
  const isDesktop = !isMobile;

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black">
      {/* Background Image Slider */}
      <LDCHeroSlider />

      {/* Content Container */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className={`grid items-center gap-8 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Left Column: Hero Text - Desktop Only */}
          {isDesktop && (
            <div>
              <LDCHeroText
                text="Te ayudamos a encontrar y descubrir lo que buscas."
                featuredWords={[
                  { word: "encontrar", bgColor: "bg-orange", gradientColor: "yellow" },
                  { word: "descubrir", bgColor: "bg-orange", gradientColor: "yellow" },
                ]}
                subText="Encuentra los mejores lugares, comercios, servicios y más en Chile."
              />
            </div>
          )}

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
