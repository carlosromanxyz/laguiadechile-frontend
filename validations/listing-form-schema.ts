import { z } from "zod";
import { DESCRIPTION_MAX_HTML, descriptionTextToHtml } from "@/lib/format/description";
import { SCHEDULE_DAYS, type IScheduleValue } from "@/lib/format/schedule";

/** Límite de fotos de la galería en el panel (el backend acepta hasta 50). */
export const GALLERY_MAX = 8;

const optionalText = (max: number, tooLong: string) =>
  z.string().trim().max(max, tooLong);

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const scheduleDay = z
  .object({
    open: z.boolean(),
    from: z.string(),
    to: z.string(),
    label: z.string().optional(),
  })
  .superRefine((day, ctx) => {
    if (!day.open || day.label) return;
    if (!TIME.test(day.from)) ctx.addIssue({ code: "custom", path: ["from"], message: "Indica a qué hora abres" });
    if (!TIME.test(day.to)) ctx.addIssue({ code: "custom", path: ["to"], message: "Indica a qué hora cierras" });
  });

const scheduleShape = Object.fromEntries(SCHEDULE_DAYS.map(([key]) => [key, scheduleDay])) as Record<
  keyof IScheduleValue,
  typeof scheduleDay
>;

/** URL con protocolo http(s), como exige el backend (`IsUrl({ require_protocol: true })`). */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Formulario de la ficha del comercio (`/dashboard/comercio/ficha`). */
export const listingFormSchema = z.object({
  title: z.string().trim().min(1, "Escribe el nombre de tu negocio").max(200, "Usa hasta 200 caracteres"),
  categoryId: z.string().min(1, "Elige una categoría"),
  cityId: z.string().min(1, "Elige una ciudad"),
  description: z
    .string()
    .trim()
    .min(1, "Cuenta qué ofrece tu negocio")
    .refine((text) => descriptionTextToHtml(text).length <= DESCRIPTION_MAX_HTML, {
      message: "La descripción es demasiado larga: acórtala un poco",
    }),
  address: optionalText(300, "Usa hasta 300 caracteres"),
  commune: optionalText(100, "Usa hasta 100 caracteres"),
  image: z.string().min(1, "Sube una imagen principal"),
  gallery: z.array(z.string()).max(50),
  phone: optionalText(40, "Usa hasta 40 caracteres"),
  whatsapp: optionalText(40, "Usa hasta 40 caracteres"),
  email: z
    .string()
    .trim()
    .max(200, "Usa hasta 200 caracteres")
    .refine((v) => v === "" || z.email().safeParse(v).success, { message: "Revisa el email" }),
  website: z
    .string()
    .trim()
    .max(500, "Usa hasta 500 caracteres")
    .refine((v) => v === "" || isHttpUrl(v), { message: "Escribe la dirección completa, con https://" }),
  schedule: z.object(scheduleShape),
});

export type LDCListingFormValues = z.infer<typeof listingFormSchema>;

/** Cuerpo que la server action acepta y reenvía a `PATCH /me/listings/:id` (ya convertido). */
export const myListingUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().min(1).max(DESCRIPTION_MAX_HTML),
  image: z.string().min(1).max(500),
  gallery: z.array(z.string().max(500)).max(50),
  categoryId: z.uuid(),
  cityId: z.uuid(),
  address: z.string().max(300).nullable(),
  commune: z.string().max(100).nullable(),
  phone: z.string().max(40).nullable(),
  whatsapp: z.string().max(40).nullable(),
  email: z.email().max(200).nullable(),
  website: z.string().max(500).refine(isHttpUrl).nullable(),
  schedule: z.record(z.string(), z.string().max(100)).nullable(),
});

/** Cuerpo que la server action de alta acepta y reenvía a `POST /me/listings` (ya convertido). */
export const myListingCreateSchema = myListingUpdateSchema.extend({
  type: z.enum(["comercio", "servicio"]),
});
