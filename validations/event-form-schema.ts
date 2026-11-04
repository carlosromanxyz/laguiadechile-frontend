import { z } from "zod";
import { DESCRIPTION_MAX_HTML, descriptionTextToHtml } from "@/lib/format/description";
import { santiagoLocalToIso } from "@/lib/format/events";
import { parseClpAmount } from "@/validations/classified-form-schema";

/** Fotos de la galería del evento (el lienzo de CLGDC-137 pide 10, como la ficha; el DTO acepta 50). */
export const EVENT_GALLERY_MAX = 10;

/** Valor máximo de la entrada (`priceAmount` ≤ 100.000.000 en el DTO). */
export const EVENT_PRICE_MAX = 100_000_000;

const HTTP_URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

const optionalText = (max: number) => z.string().trim().max(max, `Usa hasta ${max} caracteres`);
const optionalUrl = z
  .string()
  .trim()
  .max(500, "Usa hasta 500 caracteres")
  .refine((v) => v === "" || HTTP_URL.test(v), { message: "Escribe el enlace completo, empezando con https://" });

/**
 * Formulario del evento (`/dashboard/eventos/nuevo` y `/dashboard/eventos/[id]`). Las fechas van
 * como en los `<input type="date">` y `type="time"` nativos, en hora de Chile; el término es
 * opcional, pero si se pone, con fecha y hora. Con `requireFuture` (al crear), el inicio no puede
 * haber pasado.
 */
export function eventFormSchema({ requireFuture = false }: { requireFuture?: boolean } = {}) {
  return z
    .object({
      title: z.string().trim().min(1, "Escribe el nombre del evento").max(200, "Usa hasta 200 caracteres"),
      categoryId: z.string(),
      description: z
        .string()
        .trim()
        .min(1, "Cuenta de qué se trata el evento")
        .refine((text) => descriptionTextToHtml(text).length <= DESCRIPTION_MAX_HTML, {
          message: "La descripción es demasiado larga",
        }),
      startDate: z.string().regex(DATE, "Elige la fecha de inicio"),
      startTime: z.string().regex(TIME, "Elige la hora de inicio"),
      endDate: z.string(),
      endTime: z.string(),
      venueName: z.string().trim().min(1, "Escribe dónde es el evento").max(200, "Usa hasta 200 caracteres"),
      cityId: z.string().min(1, "Elige una ciudad"),
      commune: optionalText(100),
      address: optionalText(300),
      image: z.string().min(1, "Sube una imagen del evento"),
      gallery: z.array(z.string()).max(50),
      priceType: z.enum(["FREE", "PAID"]),
      priceAmount: z.string().trim(),
      ticketUrl: optionalUrl,
      organizerName: z.string().trim().min(1, "Escribe quién organiza").max(120, "Usa hasta 120 caracteres"),
      organizerPhone: optionalText(40),
      organizerWhatsapp: optionalText(40),
      organizerEmail: z
        .string()
        .trim()
        .max(200, "Usa hasta 200 caracteres")
        .refine((v) => v === "" || z.email().safeParse(v).success, { message: "Revisa el email" }),
      organizerWebsite: optionalUrl,
    })
    .superRefine((v, ctx) => {
      const start = santiagoLocalToIso(v.startDate, v.startTime);
      if (requireFuture && start && new Date(start).getTime() < Date.now()) {
        ctx.addIssue({ code: "custom", path: ["startDate"], message: "La fecha de inicio ya pasó" });
      }
      if (v.endDate || v.endTime) {
        if (!DATE.test(v.endDate)) {
          ctx.addIssue({ code: "custom", path: ["endDate"], message: "Elige la fecha de término o borra la hora" });
        } else if (!TIME.test(v.endTime)) {
          ctx.addIssue({ code: "custom", path: ["endTime"], message: "Elige la hora de término" });
        } else {
          const end = santiagoLocalToIso(v.endDate, v.endTime);
          if (start && end && new Date(end) < new Date(start)) {
            ctx.addIssue({ code: "custom", path: ["endTime"], message: "Debe ser después del inicio" });
          }
        }
      }
      if (v.priceType === "PAID") {
        const amount = parseClpAmount(v.priceAmount);
        if (amount === null || amount < 1) {
          ctx.addIssue({
            code: "custom",
            path: ["priceAmount"],
            message: "Escribe el valor de la entrada en pesos, sin puntos",
          });
        } else if (amount > EVENT_PRICE_MAX) {
          ctx.addIssue({ code: "custom", path: ["priceAmount"], message: "Revisa el valor: es demasiado alto" });
        }
      }
    });
}

export type LDCEventFormValues = z.infer<ReturnType<typeof eventFormSchema>>;

const nullableUrl = z.string().max(500).regex(HTTP_URL).nullable();

/** Cuerpo que las server actions aceptan y reenvían a `/me/events` (ya convertido). */
export const myEventInputSchema = z
  .strictObject({
    title: z.string().trim().min(1).max(200),
    description: z.string().min(1).max(DESCRIPTION_MAX_HTML),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime().nullable(),
    venueName: z.string().trim().min(1).max(200),
    address: z.string().max(300).nullable(),
    commune: z.string().max(100).nullable(),
    categoryId: z.uuid().nullable(),
    cityId: z.uuid(),
    image: z.string().min(1).max(500),
    gallery: z.array(z.string().max(500)).max(50),
    priceType: z.enum(["FREE", "PAID"]),
    priceAmount: z.number().int().min(1).max(EVENT_PRICE_MAX).nullable(),
    ticketUrl: nullableUrl,
    organizerName: z.string().trim().min(1).max(120),
    organizerPhone: z.string().max(40).nullable(),
    organizerWhatsapp: z.string().max(40).nullable(),
    organizerEmail: z.email().max(200).nullable(),
    organizerWebsite: nullableUrl,
  })
  .refine((v) => v.priceType === "PAID" || v.priceAmount === null, { path: ["priceAmount"] })
  .refine((v) => !v.endsAt || new Date(v.endsAt) >= new Date(v.startsAt), { path: ["endsAt"] });
