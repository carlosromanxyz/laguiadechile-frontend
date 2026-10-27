import { LDCHomeTemplate } from "@/components/templates/ldc-home-template";
import {
  getCategories,
  getCities,
  getFeaturedCategories,
  getFeaturedCities,
} from "@/lib/api/catalog";
import { getFeaturedListings, getRecentListings } from "@/lib/api/listings";
import { getRecentProperties } from "@/lib/api/properties";
import { getRecentClassifieds } from "@/lib/api/classifieds";
import { getRecentPosts } from "@/lib/api/posts";

/**
 * Home Page - La Guía de Chile
 *
 * Main landing page for the Chilean business directory.
 * Server Component: carga todos los datos de la home en paralelo desde la
 * DAL y se los pasa a `LDCHomeTemplate`.
 *
 * Las opciones del buscador del hero caen a `[]` si el backend falla (igual
 * que cuando el hero las pedía a `/api/categories` y `/api/cities`); el resto
 * de las secciones propaga el error, como cuando cada una hacía su fetch.
 */
export default async function HomePage() {
  const [
    searchCategories,
    searchCities,
    featuredCategories,
    featuredListings,
    recentProperties,
    featuredCities,
    recentClassifieds,
    recentListings,
    recentPosts,
  ] = await Promise.all([
    getCategories().catch(() => []),
    getCities().catch(() => []),
    getFeaturedCategories(),
    getFeaturedListings(8),
    getRecentProperties(8),
    getFeaturedCities(),
    getRecentClassifieds(6),
    getRecentListings(8),
    getRecentPosts(10),
  ]);

  return (
    <LDCHomeTemplate
      searchCategories={searchCategories}
      searchCities={searchCities}
      featuredCategories={featuredCategories}
      featuredListings={featuredListings}
      recentProperties={recentProperties}
      featuredCities={featuredCities}
      recentClassifieds={recentClassifieds}
      recentListings={recentListings}
      recentPosts={recentPosts}
    />
  );
}
