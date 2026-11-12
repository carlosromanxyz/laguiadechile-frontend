import { z } from "zod";
import {
  PROPERTY_CURRENCIES,
  PROPERTY_OPERATIONS,
  PROPERTY_TYPES,
  type IAdminCity,
  type IAdminCityUpsert,
  type IAdminNews,
  type IAdminNewsUpsert,
  type IAdminProperty,
  type IAdminPropertyUpsert,
  type IAdminPropertyType,
  type IAdminRegion,
  type IAdminRegionUpsert,
} from "@/interfaces/admin-catalog";
import { descriptionHtmlToText, descriptionTextToHtml } from "@/lib/format/description";
import type { IMyPropertyInput } from "@/interfaces/my-property";

/**
 * Formularios del catálogo admin (CLGDC-126): regiones, ciudades, noticias y propiedades.
 *
 * Los mismos schemas validan en el formulario (resolver) y en la server action (`safeParse` de lo
 * que llega), y los `to*Payload` convierten los valores (todo texto) al cuerpo de la API.
 */

const SLUG = /^[a-z0-9-]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const required = (max: number, empty: string) =>
  z.string().trim().min(1, empty).max(max, `Usa hasta ${max} caracteres`);
const optional = (max: number) => z.string().trim().max(max, `Usa hasta ${max} caracteres`);
const slug = z
  .string()
  .trim()
  .min(1, "Escribe el slug")
  .max(200, "Usa hasta 200 caracteres")
  .regex(SLUG, "Solo minúsculas, números y guiones");
/** Id de un combobox: vacío (sin elegir) o un UUID. */
const optionalId = z.string().refine((v) => v === "" || UUID.test(v), { message: "Elige una opción de la lista" });
/**
 * URL de imagen que `next/image` puede servir: una subida (`/media/u/…`), una del seed
 * (`/media/cities/…`) o una foto demo (`/media/demo/…`). Nada de hosts externos (CLGDC-84): no hay
 * `remotePatterns` en `next.config.ts`, así que cualquier otra tumbaría la página pública al
 * renderizarla.
 */
export function isAllowedImageUrl(v: string): boolean {
  if (!/^\/media\/(u|cities|demo)\/[A-Za-z0-9._/-]+$/.test(v)) return false;
  return !v.includes("..") && !v.includes("//");
}

/** Imagen opcional: vacía o permitida por `isAllowedImageUrl`. */
const imageUrl = z
  .string()
  .max(500)
  .refine((v) => v === "" || isAllowedImageUrl(v), { message: "Sube la imagen de nuevo" });

/** «1.234,5» o «1234.5» → número; `NaN` si no es un número. */
export function parseDecimal(value: string): number {
  const clean = value.trim().replace(/\s/g, "");
  if (!clean) return Number.NaN;
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
}

const decimal = (empty: string) =>
  z
    .string()
    .trim()
    .min(1, empty)
    .refine((v) => Number.isFinite(parseDecimal(v)), { message: "Escribe un número (p. ej. 1500 o 1500,5)" });
const optionalDecimal = z
  .string()
  .trim()
  .refine((v) => v === "" || Number.isFinite(parseDecimal(v)), { message: "Escribe un número (p. ej. 1500 o 1500,5)" });
const optionalInt = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{1,4}$/.test(v), { message: "Escribe un número entero" });

const orNull = (v: string) => (v.trim() ? v.trim() : null);
const decimalOrNull = (v: string) => (v.trim() ? parseDecimal(v) : null);
const intOrNull = (v: string) => (v.trim() ? Number.parseInt(v, 10) : null);

/** Día `YYYY-MM-DD` de America/Santiago de una fecha ISO. */
export function isoToSantiagoDay(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date(iso));
}

// ---------- Regiones ----------

export const regionFormSchema = z.object({
  name: required(200, "Escribe el nombre"),
  romanNumeral: required(10, "Escribe el número romano"),
  slug,
});
export type LDCRegionFormValues = z.infer<typeof regionFormSchema>;

export function regionToValues(r?: IAdminRegion): LDCRegionFormValues {
  return { name: r?.name ?? "", romanNumeral: r?.romanNumeral ?? "", slug: r?.slug ?? "" };
}

export function toRegionPayload(v: LDCRegionFormValues): IAdminRegionUpsert {
  return { name: v.name.trim(), romanNumeral: v.romanNumeral.trim().toUpperCase(), slug: v.slug.trim() };
}

// ---------- Ciudades ----------

export const cityFormSchema = z.object({
  name: required(200, "Escribe el nombre"),
  slug,
  regionId: optionalId,
  description: optional(2000),
  image: imageUrl,
  featured: z.boolean(),
  isCapital: z.boolean(),
});
export type LDCCityFormValues = z.infer<typeof cityFormSchema>;

export function cityToValues(c?: IAdminCity): LDCCityFormValues {
  return {
    name: c?.name ?? "",
    slug: c?.slug ?? "",
    regionId: c?.regionId ?? "",
    description: c?.description ?? "",
    image: c?.image ?? "",
    featured: c?.featured ?? false,
    isCapital: c?.isCapital ?? false,
  };
}

export function toCityPayload(v: LDCCityFormValues): IAdminCityUpsert {
  return {
    name: v.name.trim(),
    slug: v.slug.trim(),
    regionId: v.regionId || null,
    description: orNull(v.description),
    image: v.image || null,
    featured: v.featured,
    isCapital: v.isCapital,
  };
}

// ---------- Noticias ----------

export const newsFormSchema = z.object({
  title: required(300, "Escribe el título"),
  slug: slug.max(300, "Usa hasta 300 caracteres"),
  excerpt: required(500, "Escribe la bajada"),
  content: optional(20000),
  authorName: required(200, "Escribe el nombre del autor"),
  authorAvatar: imageUrl,
  image: imageUrl.refine((v) => v !== "", { message: "Sube una imagen principal" }),
  featured: z.boolean(),
  publishedAt: z.string().regex(DAY, "Elige la fecha de publicación"),
  categoryId: optionalId,
});
export type LDCNewsFormValues = z.infer<typeof newsFormSchema>;

export function newsToValues(n?: IAdminNews): LDCNewsFormValues {
  return {
    title: n?.title ?? "",
    slug: n?.slug ?? "",
    excerpt: n?.excerpt ?? "",
    content: n?.content ? descriptionHtmlToText(n.content) : "",
    authorName: n?.authorName ?? "",
    authorAvatar: n?.authorAvatar ?? "",
    image: n?.image ?? "",
    featured: n?.featured ?? false,
    publishedAt: isoToSantiagoDay(n?.publishedAt ?? new Date().toISOString()),
    categoryId: n?.categoryId ?? "",
  };
}

/**
 * Cuerpo de la noticia. Si el día de publicación no cambió (`keepPublishedAt`, la fecha guardada),
 * se reenvía la misma fecha con su hora; si cambió, mediodía UTC de ese día (cae el mismo día en
 * Santiago). Si el texto no cambió (`keepContent`, el HTML guardado), se reenvía ese HTML.
 */
/** El HTML tiene etiquetas además de `<p>` y `<br>` (títulos, listas, enlaces…). */
export function hasRichHtml(html: string | null | undefined): boolean {
  return Boolean(html && /<(?!\/?(p|br)\b)[a-z]/i.test(html));
}

export function toNewsPayload(
  v: LDCNewsFormValues,
  keepPublishedAt?: string,
  keepContent?: string | null,
): IAdminNewsUpsert {
  const sameDay = keepPublishedAt && isoToSantiagoDay(keepPublishedAt) === v.publishedAt;
  // Si el texto no cambió respecto del guardado, se reenvía el HTML original (no se pierde el formato).
  const sameContent = keepContent != null && descriptionHtmlToText(keepContent).trim() === v.content.trim();
  return {
    title: v.title.trim(),
    slug: v.slug.trim(),
    excerpt: v.excerpt.trim(),
    content: sameContent ? keepContent : v.content.trim() ? descriptionTextToHtml(v.content) : null,
    authorName: v.authorName.trim(),
    authorAvatar: v.authorAvatar || null,
    image: v.image,
    featured: v.featured,
    publishedAt: sameDay ? keepPublishedAt : `${v.publishedAt}T12:00:00.000Z`,
    categoryId: v.categoryId || null,
  };
}

// ---------- Propiedades ----------

export const PROPERTY_TYPE_LABELS: Record<(typeof PROPERTY_TYPES)[number], string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  TERRENO: "Terreno",
  OFICINA: "Oficina",
  LOCAL: "Local",
  BODEGA: "Bodega",
};

export const PROPERTY_OPERATION_LABELS: Record<(typeof PROPERTY_OPERATIONS)[number], string> = {
  VENTA: "Venta",
  ARRIENDO: "Arriendo",
  ARRIENDO_TEMPORAL: "Arriendo temporal",
};

export const PROPERTY_CURRENCY_LABELS: Record<(typeof PROPERTY_CURRENCIES)[number], string> = {
  UF: "UF",
  CLP: "Pesos (CLP)",
};

/** Periodo del precio de un arriendo (`pricePeriod`; vacío, sin periodo). */
export const PROPERTY_PRICE_PERIODS = ["mes", "dia", "semana"] as const;
export const PROPERTY_PRICE_PERIOD_LABELS: Record<(typeof PROPERTY_PRICE_PERIODS)[number], string> = {
  mes: "Por mes",
  dia: "Por día",
  semana: "Por semana",
};

/** Límite de fotos de la galería de una propiedad (el backend acepta hasta 50). */
export const PROPERTY_GALLERY_MAX = 12;

/** Tope de dormitorios, baños y estacionamientos (`PROPERTY_ROOMS_MAX` del backend). */
export const PROPERTY_ROOMS_MAX = 50;
const rooms = optionalInt.refine((v) => v === "" || Number.parseInt(v, 10) <= PROPERTY_ROOMS_MAX, {
  message: `Usa un número hasta ${PROPERTY_ROOMS_MAX}`,
});

export const propertyFormSchema = z.object({
  title: required(200, "Escribe el título"),
  slug,
  description: optional(5000),
  type: z.enum(PROPERTY_TYPES, { message: "Elige el tipo" }),
  operation: z.enum(PROPERTY_OPERATIONS, { message: "Elige la operación" }),
  priceAmount: decimal("Escribe el precio"),
  priceCurrency: z.enum(PROPERTY_CURRENCIES, { message: "Elige la moneda" }),
  priceCommonExpenses: optionalDecimal,
  pricePeriod: z.enum(["", ...PROPERTY_PRICE_PERIODS], { message: "Elige el periodo" }),
  surface: decimal("Escribe la superficie útil"),
  totalSurface: optionalDecimal,
  bedrooms: rooms,
  bathrooms: rooms,
  parking: rooms,
  cityId: z.string().refine((v) => UUID.test(v), { message: "Elige una ciudad" }),
  location: required(300, "Escribe la ubicación"),
  commune: optional(100),
  neighborhood: optional(100),
  image: imageUrl.refine((v) => v !== "", { message: "Sube una imagen principal" }),
  gallery: z.array(z.string().max(500).refine(isAllowedImageUrl, { message: "Sube la foto de nuevo" })).max(50),
  agentName: optional(200),
  agentPhone: optional(40),
  agentWhatsapp: optional(40),
  agentEmail: z
    .string()
    .trim()
    .max(200, "Usa hasta 200 caracteres")
    .refine((v) => v === "" || z.email().safeParse(v).success, { message: "Revisa el email" }),
  agentAgency: optional(200),
  featured: z.boolean(),
  isNew: z.boolean(),
});
export type LDCPropertyFormValues = z.input<typeof propertyFormSchema>;

const numText = (n: number | null | undefined) => (n == null ? "" : String(n).replace(".", ","));

export function propertyToValues(p?: Omit<IAdminProperty, "status">): LDCPropertyFormValues {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    description: p?.description ?? "",
    type: p?.type ?? ("" as never),
    operation: p?.operation ?? ("" as never),
    priceAmount: numText(p?.priceAmount),
    priceCurrency: p?.priceCurrency ?? "UF",
    priceCommonExpenses: numText(p?.priceCommonExpenses),
    pricePeriod: (PROPERTY_PRICE_PERIODS as readonly string[]).includes(p?.pricePeriod ?? "")
      ? (p?.pricePeriod as LDCPropertyFormValues["pricePeriod"])
      : "",
    surface: numText(p?.surface),
    totalSurface: numText(p?.totalSurface),
    bedrooms: numText(p?.bedrooms),
    bathrooms: numText(p?.bathrooms),
    parking: numText(p?.parking),
    cityId: p?.cityId ?? "",
    location: p?.location ?? "",
    commune: p?.commune ?? "",
    neighborhood: p?.neighborhood ?? "",
    image: p?.image ?? "",
    gallery: p?.gallery ?? [],
    agentName: p?.agentName ?? "",
    agentPhone: p?.agentPhone ?? "",
    agentWhatsapp: p?.agentWhatsapp ?? "",
    agentEmail: p?.agentEmail ?? "",
    agentAgency: p?.agentAgency ?? "",
    featured: p?.featured ?? false,
    isNew: p?.isNew ?? false,
  };
}

export function toPropertyPayload(v: LDCPropertyFormValues): IAdminPropertyUpsert {
  return {
    title: v.title.trim(),
    slug: v.slug.trim(),
    description: v.description.trim(),
    type: v.type,
    operation: v.operation,
    priceAmount: parseDecimal(v.priceAmount),
    priceCurrency: v.priceCurrency,
    priceCommonExpenses: decimalOrNull(v.priceCommonExpenses),
    pricePeriod: v.pricePeriod || null,
    surface: parseDecimal(v.surface),
    totalSurface: decimalOrNull(v.totalSurface),
    bedrooms: intOrNull(v.bedrooms),
    bathrooms: intOrNull(v.bathrooms),
    parking: intOrNull(v.parking),
    cityId: v.cityId,
    location: v.location.trim(),
    commune: orNull(v.commune),
    neighborhood: orNull(v.neighborhood),
    image: v.image,
    gallery: v.gallery,
    agentName: orNull(v.agentName),
    agentPhone: orNull(v.agentPhone),
    agentWhatsapp: orNull(v.agentWhatsapp),
    agentEmail: orNull(v.agentEmail),
    agentAgency: orNull(v.agentAgency),
    featured: v.featured,
    isNew: v.isNew,
  };
}

// ---------- Propiedad propia (panel del propietario, CLGDC-164) ----------

/** Tipos con dormitorios (como `getPropertyRooms`): casa y departamento. */
export const PROPERTY_TYPES_WITH_BEDROOMS: readonly IAdminPropertyType[] = ["CASA", "DEPARTAMENTO"];
/** Tipos con construcción (baños, estacionamientos y gastos comunes): todos menos terreno. */
export const PROPERTY_TYPES_WITH_BUILDING: readonly IAdminPropertyType[] = [
  "CASA",
  "DEPARTAMENTO",
  "OFICINA",
  "LOCAL",
  "BODEGA",
];

/** Operaciones de arriendo: solo ellas llevan periodo del precio. */
export const isRentOperation = (op: string) => op === "ARRIENDO" || op === "ARRIENDO_TEMPORAL";

/**
 * Formulario del dueño: el mismo de `propertyFormSchema` sin validar `slug`, `featured` ni `isNew`
 * (los pone el servidor o el equipo) y con al menos un medio de contacto, para que la ficha
 * pública (`LDCPropertyAgent`) tenga a qué botón llevar.
 */
export const myPropertyFormSchema = propertyFormSchema
  .extend({
    slug: z.string(),
    featured: z.boolean(),
    isNew: z.boolean(),
    // `IsSafeDescription` del backend: sin `<` ni `>` (la descripción es texto plano).
    description: optional(5000).refine((v) => !/[<>]/.test(v), { message: "No uses los signos < ni >" }),
  })
  .refine((v) => [v.agentPhone, v.agentWhatsapp, v.agentEmail].some((c) => c.trim() !== ""), {
    message: "Deja al menos un teléfono, WhatsApp o email",
    path: ["agentPhone"],
  });

/**
 * Cuerpo de `POST`/`PATCH /me/properties`: lo que no aplica al tipo o a la operación va en `null`
 * (dormitorios fuera de casa y departamento; baños, estacionamientos y gastos comunes en un
 * terreno; periodo fuera de un arriendo), para que no quede un dato oculto en la propiedad.
 */
export function toMyPropertyPayload(v: LDCPropertyFormValues): IMyPropertyInput {
  const full = toPropertyPayload(v);
  const rest: IMyPropertyInput = { ...full };
  // `slug`, `featured` e `isNew` no van: con `forbidNonWhitelisted`, el backend respondería 400.
  delete (rest as Partial<IAdminPropertyUpsert>).slug;
  delete (rest as Partial<IAdminPropertyUpsert>).featured;
  delete (rest as Partial<IAdminPropertyUpsert>).isNew;
  const building = PROPERTY_TYPES_WITH_BUILDING.includes(v.type);
  return {
    ...rest,
    bedrooms: PROPERTY_TYPES_WITH_BEDROOMS.includes(v.type) ? rest.bedrooms : null,
    bathrooms: building ? rest.bathrooms : null,
    parking: building ? rest.parking : null,
    priceCommonExpenses: building ? rest.priceCommonExpenses : null,
    pricePeriod: isRentOperation(v.operation) ? rest.pricePeriod : null,
  };
}
