import { LDCHero } from "@/components/organisms/ldc-hero";
import { LDCFeaturedCategories } from "@/components/organisms/ldc-featured-categories";
import { LDCFeaturedListings } from "@/components/organisms/ldc-featured-listings";
import { LDCRecentProperties } from "@/components/organisms/ldc-recent-properties";
import { LDCFeaturedCities } from "@/components/organisms/ldc-featured-cities";
import { LDCRecentClassifieds } from "@/components/organisms/ldc-recent-classifieds";
import { LDCRecentListings } from "@/components/organisms/ldc-recent-listings";
import { LDCRecentPosts } from "@/components/organisms/ldc-recent-posts";
import type { IHomeData } from "@/interfaces/home";

/**
 * LDCHomeTemplate - Home Page Template
 *
 * Esqueleto de la home. No pide datos: los recibe por props desde
 * `app/(main)/page.tsx` y los reparte entre las secciones.
 *
 * Sections:
 * - Hero: Full-screen hero with search and featured content
 * - Featured Categories: Grid of popular categories
 * - Featured Listings: Grid of featured businesses and services
 * - Recent Properties: Grid of recent property listings
 * - Featured Cities: Grid of featured Chilean cities
 * - Recent Classifieds: List of recent classified ads
 * - Recent Listings: Grid of most recent publications
 * - Recent Posts: Grid of recent news articles
 *
 * @example
 * <LDCHomeTemplate {...homeData} />
 */
export function LDCHomeTemplate({
  searchCategories,
  searchCities,
  featuredCategories,
  featuredListings,
  recentProperties,
  featuredCities,
  recentClassifieds,
  recentListings,
  recentPosts,
}: IHomeData) {
  return (
    <>
      {/* Hero Section */}
      <LDCHero categories={searchCategories} cities={searchCities} />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Featured Categories Section */}
        <LDCFeaturedCategories categories={featuredCategories} />

        {/* Featured Listings Section */}
        <LDCFeaturedListings listings={featuredListings} />

        {/* Recent Properties Section */}
        <LDCRecentProperties properties={recentProperties} />

        {/* Featured Cities Section */}
        <LDCFeaturedCities cities={featuredCities} />

        {/* Recent Classifieds Section */}
        <LDCRecentClassifieds classifieds={recentClassifieds} />

        {/* Recent Listings Section */}
        <LDCRecentListings listings={recentListings} />

        {/* Recent Posts Section */}
        <LDCRecentPosts posts={recentPosts} />
      </main>
    </>
  );
}
