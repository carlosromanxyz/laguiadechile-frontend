"use server";

import { headers } from "next/headers";
import type { IContactFormInput, IContactFormResult } from "@/interfaces/contact-message";
import { getSocketIp } from "@/lib/auth/socket-ip";
import { contactFormSchema } from "@/validations/contact-form-schema";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";
const BACKEND_TIMEOUT_MS = 10000;

const INVALID = "Revisa los campos: completa tu nombre, un correo válido, el asunto y el mensaje.";
const THROTTLED =
  "Ya enviaste varios mensajes en poco tiempo. Espera un rato y vuelve a intentarlo.";
const FAILED = "No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.";

/**
 * Envía el formulario público de contacto a `POST /contact` (CLGDC-119).
 *
 * `X-Forwarded-For` lleva solo la IP del socket marcada por el gancho de `instrumentation.ts`
 * (`getSocketIp`), nunca la cabecera que mande el cliente: es la clave del throttle (5 por hora).
 * El honeypot `website` se reenvía tal cual: con valor, el backend responde 202 igual sin guardar
 * ni enviar nada, así el bot no distingue. Los textos de error son fijos (nunca el mensaje crudo
 * del backend).
 */
export async function sendContactMessageAction(input: IContactFormInput): Promise<IContactFormResult> {
  // Mismo esquema que el formulario: solo pasan los cinco campos, ya recortados.
  const parsed = contactFormSchema.safeParse(input ?? {});
  if (!parsed.success) return { ok: false, reason: "invalid", message: INVALID };
  const body = parsed.data;

  const ip = getSocketIp(await headers());
  let res: Response;
  try {
    res = await fetch(`${INTERNAL_BASE}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(ip ? { "X-Forwarded-For": ip } : {}),
      },
      body: JSON.stringify(body.website ? body : { ...body, website: undefined }),
      cache: "no-store",
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, reason: "error", message: FAILED };
  }

  if (res.ok) return { ok: true };
  if (res.status === 429) return { ok: false, reason: "throttled", message: THROTTLED };
  if (res.status === 400) return { ok: false, reason: "invalid", message: INVALID };
  return { ok: false, reason: "error", message: FAILED };
}
