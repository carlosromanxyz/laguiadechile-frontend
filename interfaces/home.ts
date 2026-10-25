import type { ICategories } from "@/interfaces/category";
import type { ICities } from "@/interfaces/city";
import type { IClassifieds } from "@/interfaces/classified";
import type { IFeaturedCategories } from "@/interfaces/featured-category";
import type { IFeaturedCities } from "@/interfaces/featured-city";
import type { IListingDetails } from "@/interfaces/listing";
import type { IPosts } from "@/interfaces/post";
import type { IProperties } from "@/interfaces/property";

/**
 * Datos de la home: los carga `app/(main)/page.tsx` desde la DAL y los
 * recibe `LDCHomeTemplate`, que los reparte entre sus secciones.
 */
export interface IHomeData {
  /** Opciones del buscador del hero. */
  searchCategories: ICategories;
  /** Opciones del buscador del hero. */
  searchCities: ICities;
  featuredCategories: IFeaturedCategories;
  featuredListings: IListingDetails;
  recentProperties: IProperties;
  featuredCities: IFeaturedCities;
  recentClassifieds: IClassifieds;
  recentListings: IListingDetails;
  recentPosts: IPosts;
}
