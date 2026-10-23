/**
 * Pure mappers: NestJS backend (flat) response shapes → frontend interfaces
 * (nested). Used by the server-only DAL (`lib/api/*`). No fetch/server-only here
 * so they stay trivially testable and tree-shakeable.
 */
import type { IListingDetail } from "@/interfaces/listing";
import type { IClassified } from "@/interfaces/classified";
import type { IProperty } from "@/interfaces/property";
import type { INews } from "@/interfaces/news";
import type { IFeaturedCategory } from "@/interfaces/featured-category";
import type { IFeaturedCity } from "@/interfaces/featured-city";

// ---- Backend raw shapes (only the fields we read) ----
interface RawCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}
interface RawCity {
  id: string;
  name: string;
  slug: string;
}
interface RawListing {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  image: string;
  featured: boolean;
  address?: string | null;
  commune?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  whatsapp?: string | null;
  schedule?: unknown;
  socialMedia?: unknown;
  gallery?: string[];
  category: RawCategory;
  city: RawCity;
  createdAt: string;
  updatedAt: string;
}
interface RawClassified {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  priceType?: string | null;
  priceAmount?: number | null;
  image: string;
  gallery?: string[];
  sellerName?: string | null;
  sellerPhone?: string | null;
  sellerWhatsapp?: string | null;
  sellerEmail?: string | null;
  featured: boolean;
  expiresAt?: string | null;
  commune?: string | null;
  category?: RawCategory | null;
  city: RawCity;
  createdAt: string;
}
interface RawProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  operation: string;
  priceAmount: number;
  priceCurrency: string;
  priceCommonExpenses?: number | null;
  pricePeriod?: string | null;
  surface: number;
  totalSurface?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  commune?: string | null;
  neighborhood?: string | null;
  image: string;
  gallery?: string[];
  agentName?: string | null;
  agentPhone?: string | null;
  agentWhatsapp?: string | null;
  agentEmail?: string | null;
  agentAgency?: string | null;
  featured: boolean;
  isNew: boolean;
  city: RawCity;
  createdAt: string;
}
interface RawNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  authorName: string;
  authorAvatar?: string | null;
  image: string;
  featured: boolean;
  publishedAt: string;
  category?: RawCategory | null;
  createdAt: string;
  updatedAt: string;
}

const cat = (c: RawCategory) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  icon: c.icon ?? "",
});
const city = (c: RawCity) => ({ id: c.id, name: c.name, slug: c.slug });

export function mapListing(l: RawListing): IListingDetail {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    type: l.type.toLowerCase() as IListingDetail["type"],
    category: cat(l.category),
    city: city(l.city),
    image: l.image,
    featured: l.featured,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
    description: l.description,
    address: l.address ?? undefined,
    commune: l.commune ?? undefined,
    contact: {
      phone: l.phone ?? undefined,
      email: l.email ?? undefined,
      website: l.website ?? undefined,
      whatsapp: l.whatsapp ?? undefined,
    },
    socialMedia: (l.socialMedia as IListingDetail["socialMedia"]) ?? {},
    schedule: (l.schedule as IListingDetail["schedule"]) ?? undefined,
    gallery: l.gallery ?? [],
  };
}

export function mapClassified(c: RawClassified): IClassified {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    type: c.type.toLowerCase() as IClassified["type"],
    category: c.category
      ? cat(c.category)
      : { id: "", name: "", slug: "", icon: "" },
    city: city(c.city),
    commune: c.commune ?? undefined,
    image: c.image,
    price: {
      type: (c.priceType ?? "contact") as IClassified["price"]["type"],
      amount: c.priceAmount ?? undefined,
    },
    featured: c.featured,
    createdAt: c.createdAt,
    expiresAt: c.expiresAt ?? "",
    seller: {
      name: c.sellerName ?? "",
      phone: c.sellerPhone ?? undefined,
      whatsapp: c.sellerWhatsapp ?? undefined,
      email: c.sellerEmail ?? undefined,
    },
    gallery: c.gallery ?? [],
  };
}

export function mapProperty(p: RawProperty): IProperty {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    type: p.type.toLowerCase() as IProperty["type"],
    operation: p.operation
      .toLowerCase()
      .replace("_", "-") as IProperty["operation"],
    price: {
      amount: p.priceAmount,
      currency: p.priceCurrency.toLowerCase() as IProperty["price"]["currency"],
      commonExpenses: p.priceCommonExpenses ?? undefined,
      period: (p.pricePeriod as IProperty["price"]["period"]) ?? undefined,
    },
    features: {
      surface: p.surface,
      totalSurface: p.totalSurface ?? undefined,
      bedrooms: p.bedrooms ?? 0,
      bathrooms: p.bathrooms ?? 0,
      parking: p.parking ?? 0,
    },
    location: {
      city: { name: p.city.name, slug: p.city.slug },
      commune: p.commune ?? "",
      neighborhood: p.neighborhood ?? undefined,
    },
    image: p.image,
    images: p.gallery ?? [],
    featured: p.featured,
    isNew: p.isNew,
    createdAt: p.createdAt,
    agent: {
      name: p.agentName ?? "",
      phone: p.agentPhone ?? undefined,
      whatsapp: p.agentWhatsapp ?? undefined,
      email: p.agentEmail ?? undefined,
      agency: p.agentAgency ?? undefined,
    },
  };
}

export function mapNews(n: RawNews): INews {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    content: n.content ?? "",
    category: n.category ? cat(n.category) : { id: "", name: "", slug: "", icon: "" },
    author: { name: n.authorName, avatar: n.authorAvatar ?? "" },
    image: n.image,
    featured: n.featured,
    createdAt: n.publishedAt ?? n.createdAt,
    updatedAt: n.updatedAt,
  };
}

// ---- Catalog mappers (home presentational shapes) ----
interface RawFeaturedCategory extends RawCategory {
  description?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  count?: number;
  featured?: boolean;
}
interface RawFeaturedCity extends RawCity {
  image?: string | null;
  count?: number;
  featured?: boolean;
}

export function mapFeaturedCategory(c: RawFeaturedCategory): IFeaturedCategory {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    icon: c.icon ?? "",
    count: c.count ?? 0,
    featured: !!c.featured,
    gradient: { from: c.gradientFrom ?? "pink", to: c.gradientTo ?? "purple" },
  };
}

export function mapFeaturedCity(c: RawFeaturedCity): IFeaturedCity {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? `https://picsum.photos/seed/city-${c.slug}/800/600`,
    count: c.count ?? 0,
    featured: !!c.featured,
  };
}

export type {
  RawListing,
  RawClassified,
  RawProperty,
  RawNews,
  RawCategory,
  RawCity,
};
