/**
 * Catálogo del panel admin (CLGDC-126): regiones, ciudades, noticias y propiedades tal como las
 * devuelven `GET /regions`, `/cities`, `/news` y `/properties`, y los cuerpos de `POST`/`PATCH`.
 */

/** Región con sus ciudades (`GET /regions`). */
export interface IAdminRegion {
  id: string;
  name: string;
  romanNumeral: string;
  slug: string;
  cities: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface IAdminRegionUpsert {
  name: string;
  romanNumeral: string;
  slug: string;
}

/** Ciudad con su región (`GET /cities`). */
export interface IAdminCity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  count: number;
  featured: boolean;
  isCapital: boolean;
  regionId: string | null;
  region: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCityUpsert {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  isCapital: boolean;
  regionId: string | null;
}

/** Noticia con su categoría (`GET /news`); `content` es HTML mínimo (`<p>`). */
export interface IAdminNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  authorName: string;
  authorAvatar: string | null;
  image: string;
  featured: boolean;
  publishedAt: string;
  categoryId: string | null;
  category: { id: string; name: string; slug: string; icon: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminNewsUpsert {
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  authorName: string;
  authorAvatar: string | null;
  image: string;
  featured: boolean;
  /** ISO 8601 */
  publishedAt: string;
  categoryId: string | null;
}

export const PROPERTY_TYPES = ["CASA", "DEPARTAMENTO", "TERRENO", "OFICINA", "LOCAL", "BODEGA"] as const;
export const PROPERTY_OPERATIONS = ["VENTA", "ARRIENDO", "ARRIENDO_TEMPORAL"] as const;
export const PROPERTY_CURRENCIES = ["UF", "CLP"] as const;

export type IAdminPropertyType = (typeof PROPERTY_TYPES)[number];
export type IAdminPropertyOperation = (typeof PROPERTY_OPERATIONS)[number];
export type IAdminPropertyCurrency = (typeof PROPERTY_CURRENCIES)[number];

/** Propiedad con su ciudad (`GET /properties`). */
export interface IAdminProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: IAdminPropertyType;
  operation: IAdminPropertyOperation;
  priceAmount: number;
  priceCurrency: IAdminPropertyCurrency;
  priceCommonExpenses: number | null;
  pricePeriod: string | null;
  surface: number;
  totalSurface: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  location: string;
  commune: string | null;
  neighborhood: string | null;
  image: string;
  gallery: string[];
  agentName: string | null;
  agentPhone: string | null;
  agentWhatsapp: string | null;
  agentEmail: string | null;
  agentAgency: string | null;
  featured: boolean;
  isNew: boolean;
  /** Estado de publicación (`PublicationStatus`, CLGDC-164); lo trae `GET /admin/properties/:id`. */
  status?: "PUBLISHED" | "REVIEW" | "REJECTED" | "EXPIRED" | "ARCHIVED";
  cityId: string;
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export type IAdminPropertyUpsert = Omit<IAdminProperty, "id" | "city" | "createdAt" | "updatedAt">;
