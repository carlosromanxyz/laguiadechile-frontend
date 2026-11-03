import { z } from "zod";

/**
 * Largo máximo de la descripción del aviso. Los avisos guardan **texto plano** (como los del seed y
 * como los pinta `/aviso/[slug]`, con `whitespace-pre-line`), no el HTML mínimo de las fichas.
 */
export const CLASSIFIED_DESCRIPTION_MAX = 5000;

/** El backend (`IsSafeDescription`) rechaza `<` y `>` fuera de `<p>`/`<br>`: en texto plano, ninguno. */
const NO_ANGLES = /^[^<>]*$/;

/** Tipos de aviso, en el orden del selector. */
export const CLASSIFIED_TYPES = ["vendo", "compro", "arriendo", "busco", "ofrezco"] as const;

/** Formas de precio, en el orden del control segmentado. */
export const CLASSIFIED_PRICE_TYPES = ["fixed", "negotiable", "free", "contact"] as const;

/** Precio máximo aceptado (pesos): evita montos absurdos por un cero de más. */
export const CLASSIFIED_PRICE_MAX = 10_000_000_000;

const optionalText = (max: number) => z.string().trim().max(max, `Usa hasta ${max} caracteres`);

/** Precio escrito por el usuario («180.000», «$ 180000») → entero en pesos, o `null` si no es un número. */
export function parseClpAmount(text: string): number | null {
  const digits = text.replace(/[\s$.]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) ? n : null;
}

/** Formulario del aviso clasificado (`/dashboard/avisos/nuevo` y `/dashboard/avisos/[id]`). */
export const classifiedFormSchema = z
  .object({
    type: z.enum(CLASSIFIED_TYPES),
    title: z.string().trim().min(1, "Escribe un título para tu aviso").max(200, "Usa hasta 200 caracteres"),
    categoryId: z.string(),
    cityId: z.string().min(1, "Elige una ciudad"),
    commune: optionalText(100),
    description: z
      .string()
      .trim()
      .min(1, "Cuenta qué ofreces o qué buscas")
      .max(CLASSIFIED_DESCRIPTION_MAX, `Usa hasta ${CLASSIFIED_DESCRIPTION_MAX} caracteres`)
      .regex(NO_ANGLES, "No uses los signos < ni >"),
    priceType: z.enum(CLASSIFIED_PRICE_TYPES),
    priceAmount: z.string().trim(),
    image: z.string().min(1, "Sube una imagen principal"),
    gallery: z.array(z.string()).max(50),
    sellerName: optionalText(120),
    sellerPhone: optionalText(40),
    sellerWhatsapp: optionalText(40),
    sellerEmail: z
      .string()
      .trim()
      .max(200, "Usa hasta 200 caracteres")
      .refine((v) => v === "" || z.email().safeParse(v).success, { message: "Revisa el email" }),
  })
  .superRefine((v, ctx) => {
    if (!v.sellerPhone.trim() && !v.sellerWhatsapp.trim() && !v.sellerEmail.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["sellerPhone"],
        message: "Deja al menos un teléfono, un WhatsApp o un email para que te contacten",
      });
    }
    if (v.priceType !== "fixed") return;
    const amount = parseClpAmount(v.priceAmount);
    if (amount === null || amount < 1) {
      ctx.addIssue({ code: "custom", path: ["priceAmount"], message: "Escribe el precio en pesos, solo números" });
    } else if (amount > CLASSIFIED_PRICE_MAX) {
      ctx.addIssue({ code: "custom", path: ["priceAmount"], message: "Revisa el precio: es demasiado alto" });
    }
  });

export type LDCClassifiedFormValues = z.infer<typeof classifiedFormSchema>;

/** Cuerpo que las server actions aceptan y reenvían a `/me/classifieds` (ya convertido). */
export const myClassifiedInputSchema = z
  .strictObject({
    type: z.enum(CLASSIFIED_TYPES),
    title: z.string().trim().min(1).max(200),
    description: z.string().min(1).max(CLASSIFIED_DESCRIPTION_MAX).regex(NO_ANGLES),
    categoryId: z.uuid().nullable(),
    cityId: z.uuid(),
    commune: z.string().max(100).nullable(),
    priceType: z.enum(CLASSIFIED_PRICE_TYPES),
    priceAmount: z.number().int().min(1).max(CLASSIFIED_PRICE_MAX).nullable(),
    image: z.string().min(1).max(500),
    gallery: z.array(z.string().max(500)).max(50),
    sellerName: z.string().max(120).nullable(),
    sellerPhone: z.string().max(40).nullable(),
    sellerWhatsapp: z.string().max(40).nullable(),
    sellerEmail: z.email().max(200).nullable(),
  })
  .refine((v) => (v.priceType === "fixed") === (v.priceAmount !== null), { path: ["priceAmount"] })
  .refine((v) => Boolean(v.sellerPhone || v.sellerWhatsapp || v.sellerEmail), { path: ["sellerPhone"] });
