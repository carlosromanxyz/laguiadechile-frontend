import "server-only";
import type { IListing } from "@/interfaces/listing";
import { getTotalCitiesCount } from "./catalog";
import { getFeaturedListings, getListings } from "./listings";
import { getNews } from "./news";
import { getProperties } from "./properties";

/** Datos de la portada de acceso; coincide con las props de `LDCAuthCover`. */
export interface AuthCoverData {
  listing: IListing | null;
  stats: { value: number; label: string }[];
}

/**
 * Datos de la portada de las páginas de acceso (`LDCAuthCover`): un comercio
 * destacado y los conteos reales de la guía. Si la API falla devuelve `null` y
 * la página sigue sin portada.
 */
export async function getAuthCoverData(): Promise<AuthCoverData | null> {
  try {
    const [featured, listings, properties, news, cities] = await Promise.all([
      getFeaturedListings(1),
      getListings(),
      getProperties(),
      getNews(),
      getTotalCitiesCount(),
    ]);
    return {
      listing: featured[0] ?? null,
      stats: [
        { value: listings.length, label: "comercios y servicios" },
        { value: properties.length, label: "propiedades" },
        { value: news.length, label: "noticias" },
        { value: cities, label: "ciudades" },
      ],
    };
  } catch {
    return null;
  }
}
