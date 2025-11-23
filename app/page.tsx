import { LDCHero } from "@/components/organisms/ldc-hero";
import { LDCFeaturedCategories } from "@/components/organisms/ldc-featured-categories";

/**
 * Home Page - La Guía de Chile
 *
 * This is the main landing page for the Chilean business directory.
 * Server Component (default in Next.js App Router)
 *
 * Sections:
 * - Hero: Full-screen hero with search and featured content
 * - Featured Categories: Grid of popular categories
 * - Main Content: Featured businesses, cities, recent listings, etc.
 */

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <LDCHero />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Featured Categories Section */}
        <LDCFeaturedCategories />

        {/* Additional sections will go here */}
        {/* Featured businesses, recent listings, cities, etc. */}
      </main>
    </>
  );
}
