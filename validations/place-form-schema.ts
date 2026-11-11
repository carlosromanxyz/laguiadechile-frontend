import { z } from "zod";
import type { IAdminPlace, IAdminPlaceUpsert, IMyPlace, IMyPlaceUpsert, IPlaceType } from "@/interfaces/place";
import { DESCRIPTION_MAX_HTML, descriptionHtmlToText, descriptionTextToHtml } from "@/lib/format/description";
import { scheduleFromApi, scheduleToApi } from "@/lib/format/schedule";
import { isAllowedImageUrl } from "./admin-catalog-schema";
import { GALLERY_MAX, isHttpUrl, scheduleValueSchema } from "./listing-form-schema";

/**
 * Formulario de un lugar del admin (CLGDC-207). El mismo schema valida en el formulario (resolver)
 * y en la server action (`safeParse` de lo que llega); `toPlacePayload` lo convierte al cuerpo de
 * `POST /places` y `PATCH /places/:id`. Los límites son los del DTO del backend.
 *
 * El dueño (CLGDC-209, `LDCPlaceForm variant="owner"`) usa los mismos valores, pero su server action
 * valida con `myPlaceFormSchema` (sin `slug`, `featured` ni `emergencyNumber`, que Zod descarta) y
 * arma el cuerpo de `/me/places` con `toMyPlacePayload`, que nunca los manda.
 */

const PLACE_TYPE_VALUES = ["ATTRACTION", "PUBLIC_SERVICE", "MARKET"] as const satisfies readonly IPlaceType[];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Número corto de emergencia: 3 o 4 dígitos (131, 1405). */
const EMERGENCY_NUMBER = /^\d{3,4}$/;

const text = (max: number) => z.string().trim().max(max, `Usa hasta ${max} caracteres`);
const required = (max: number, empty: string) => text(max).min(1, empty);

export const placeFormSchema = z.object({
  type: z.enum(PLACE_TYPE_VALUES, { message: "Elige el tipo de lugar" }),
  cityId: z.string().refine((v) => UUID.test(v), { message: "Elige una ciudad" }),
  title: required(200, "Escribe el nombre del lugar"),
  slug: text(200).refine((v) => v === "" || SLUG.test(v), {
    message: "Solo minúsculas, números y guiones simples",
  }),
  description: z
    .string()
    .trim()
    .min(1, "Cuenta qué es y qué se puede hacer ahí")
    .refine((v) => descriptionTextToHtml(v).length <= DESCRIPTION_MAX_HTML, {
      message: "La descripción es demasiado larga: acórtala un poco",
    }),
  image: z
    .string()
    .max(500)
    .refine((v) => v !== "", { message: "Sube una imagen principal" })
    .refine((v) => v === "" || isAllowedImageUrl(v), { message: "Sube la imagen de nuevo" }),
  gallery: z
    .array(z.string().max(500).refine(isAllowedImageUrl, { message: "Sube la foto de nuevo" }))
    .max(50),
  address: required(300, "Escribe la dirección"),
  commune: text(100),
  schedule: scheduleValueSchema,
  phone: text(40),
  emergencyNumber: z
    .string()
    .trim()
    .refine((v) => v === "" || EMERGENCY_NUMBER.test(v), { message: "Usa 3 o 4 dígitos (por ejemplo, 131)" }),
  website: text(500).refine((v) => v === "" || isHttpUrl(v), {
    message: "Escribe la dirección completa, con https://",
  }),
  email: text(200).refine((v) => v === "" || z.email().safeParse(v).success, { message: "Revisa el email" }),
  featured: z.boolean(),
});

export type LDCPlaceFormValues = z.infer<typeof placeFormSchema>;

export { GALLERY_MAX as PLACE_GALLERY_MAX };

export function placeToValues(p?: IAdminPlace): LDCPlaceFormValues {
  return {
    type: p?.type ?? "ATTRACTION",
    cityId: p?.cityId ?? "",
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    description: p?.description ? descriptionHtmlToText(p.description) : "",
    image: p?.image ?? "",
    gallery: p?.gallery ?? [],
    address: p?.address ?? "",
    commune: p?.commune ?? "",
    schedule: scheduleFromApi(p?.schedule),
    phone: p?.phone ?? "",
    emergencyNumber: p?.emergencyNumber ?? "",
    website: p?.website ?? "",
    email: p?.email ?? "",
    featured: p?.featured ?? false,
  };
}

/**
 * Cuerpo para la API. Sin slug, no se manda (el backend lo genera al crear y lo conserva al editar).
 * Si el texto no cambió respecto del guardado (`keepDescription`, el HTML), se reenvía ese HTML.
 */
export function toPlacePayload(v: LDCPlaceFormValues, keepDescription?: string): IAdminPlaceUpsert {
  const sameDescription =
    keepDescription != null && descriptionHtmlToText(keepDescription).trim() === v.description.trim();
  const orNull = (s: string) => (s.trim() ? s.trim() : null);
  return {
    type: v.type,
    cityId: v.cityId,
    title: v.title.trim(),
    ...(v.slug.trim() ? { slug: v.slug.trim() } : {}),
    description: sameDescription ? keepDescription : descriptionTextToHtml(v.description),
    image: v.image,
    gallery: v.gallery,
    address: v.address.trim(),
    commune: orNull(v.commune),
    schedule: scheduleToApi(v.schedule),
    phone: orNull(v.phone),
    emergencyNumber: v.type === "PUBLIC_SERVICE" ? orNull(v.emergencyNumber) : null,
    website: orNull(v.website),
    email: orNull(v.email),
    featured: v.featured,
  };
}

/**
 * Lo que valida la server action del dueño (CLGDC-209): el schema del admin sin `slug`, `featured`
 * ni `emergencyNumber`. `safeParse` descarta esas claves aunque lleguen.
 */
export const myPlaceFormSchema = placeFormSchema.omit({ slug: true, featured: true, emergencyNumber: true });

export type LDCMyPlaceFormValues = z.infer<typeof myPlaceFormSchema>;

/** Valores iniciales del formulario del dueño: los campos solo del admin quedan vacíos (ocultos). */
export function myPlaceToValues(p?: IMyPlace): LDCPlaceFormValues {
  const base = placeToValues(p ? { ...p, status: undefined, rejectionReason: null } : undefined);
  return { ...base, slug: "", emergencyNumber: "", featured: false };
}

/**
 * Cuerpo de `POST /me/places` y `PATCH /me/places/:id`: el del admin sin `slug`, `featured` ni
 * `emergencyNumber` (el backend responde 400 si llegan). Mismo criterio para la descripción.
 */
export function toMyPlacePayload(v: LDCMyPlaceFormValues, keepDescription?: string): IMyPlaceUpsert {
  const full = toPlacePayload({ ...v, slug: "", featured: false, emergencyNumber: "" }, keepDescription);
  return {
    type: full.type,
    cityId: full.cityId,
    title: full.title,
    description: full.description,
    image: full.image,
    gallery: full.gallery,
    address: full.address,
    commune: full.commune,
    schedule: full.schedule,
    phone: full.phone,
    website: full.website,
    email: full.email,
  };
}
