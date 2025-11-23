import { LDCHero } from "@/components/organisms/ldc-hero";
import { LDCFeaturedCategories } from "@/components/organisms/ldc-featured-categories";
import { LDCFeaturedListings } from "@/components/organisms/ldc-featured-listings";
import { LDCFeaturedCities } from "@/components/organisms/ldc-featured-cities";
import { LDCRecentListings } from "@/components/organisms/ldc-recent-listings";

/**
 * Home Page - La Guía de Chile
 *
 * This is the main landing page for the Chilean business directory.
 * Server Component (default in Next.js App Router)
 *
 * Sections:
 * - Hero: Full-screen hero with search and featured content
 * - Featured Categories: Grid of popular categories
 * - Featured Listings: Grid of featured businesses and services
 * - Featured Cities: Grid of featured Chilean cities
 * - Recent Listings: Grid of most recent publications
 * - Main Content: Posts, etc.
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

        {/* Featured Listings Section */}
        <LDCFeaturedListings />

        {/* Featured Cities Section */}
        <LDCFeaturedCities />

        {/* Recent Listings Section */}
        <LDCRecentListings />

        {/* Additional sections will go here */}
        {/* Posts, etc. */}
      </main>
    </>
  );
}
