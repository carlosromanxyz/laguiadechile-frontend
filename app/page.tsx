import { LDCHero } from "@/components/organisms/ldc-hero";

/**
 * Home Page - La Guía de Chile
 *
 * This is the main landing page for the Chilean business directory.
 * Server Component (default in Next.js App Router)
 *
 * Sections:
 * - Hero: Full-screen hero with search and featured content
 * - Main Content: Featured categories, businesses, cities, etc.
 */

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <LDCHero />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Primary content sections will go here */}
        {/* Featured categories, popular businesses, recent listings, etc. */}
      </main>
    </>
  );
}
