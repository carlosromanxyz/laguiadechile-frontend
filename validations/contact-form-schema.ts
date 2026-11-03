import { z } from "zod";
import { CONTACT_LIMITS, isValidContactEmail } from "@/lib/contact/limits";

/**
 * Formulario público de contacto (CLGDC-124): lo usan `LDCContactForm` (antes de enviar) y
 * `sendContactMessageAction` (antes de llamar a `POST /contact`). Mismos topes que
 * `CreateContactMessageDto` del backend (`CONTACT_LIMITS`); el backend vuelve a validar.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Escribe tu nombre").max(CONTACT_LIMITS.name, "El nombre es muy largo"),
  email: z.string().trim().refine(isValidContactEmail, "Escribe un correo válido"),
  subject: z
    .string()
    .trim()
    .min(1, "Escribe el asunto")
    .max(CONTACT_LIMITS.subject, "El asunto es muy largo"),
  message: z
    .string()
    .trim()
    .min(1, "Escribe tu mensaje")
    .max(CONTACT_LIMITS.message, "El mensaje es muy largo"),
  /** Honeypot: oculto y vacío para una persona; con valor, el backend lo descarta sin avisar */
  website: z.string().max(2000).catch(""),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
