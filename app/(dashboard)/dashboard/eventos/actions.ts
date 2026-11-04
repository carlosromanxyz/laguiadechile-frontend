"use server";

import { revalidatePath } from "next/cache";
import type { IMyEventInput, IMyEventResult } from "@/interfaces/event";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole, requireDashboardSession } from "@/lib/dashboard/session";
import { createMyEvent, updateMyEvent } from "@/services/me/events";
import { myEventInputSchema } from "@/validations/event-form-schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown, verb: "enviar" | "guardar"): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return `No pudimos ${verb} tu evento: revisa los datos, las fechas y las fotos e inténtalo de nuevo.`;
  if (status === 401) return `Tu sesión expiró. Vuelve a ingresar para ${verb} tu evento.`;
  if (status === 403) return "Tu cuenta no puede publicar eventos.";
  if (status === 404) return "No encontramos este evento en tu cuenta.";
  if (status === 429) return "Ya enviaste varios eventos en la última hora. Vuelve a intentarlo más tarde.";
  return `No pudimos ${verb} tu evento. Inténtalo de nuevo en unos minutos.`;
}

/** Refresca el panel (menú y «Mis eventos») y lo público donde el evento aparecía. */
function revalidateEvent(slug: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/eventos");
  revalidatePath(`/evento/${slug}`);
}

/**
 * Crea un evento propio (`POST /me/events`). Entra cualquier cuenta con sesión: el backend deja el
 * evento en `REVIEW` y suma ORGANIZADOR a los roles en la misma transacción. Se revalida todo el
 * panel (`layout`) para que el menú relea los roles y aparezca «Mis eventos». La redirección la
 * hace el formulario después del toast.
 */
export async function createMyEventAction(input: IMyEventInput): Promise<IMyEventResult> {
  await requireDashboardSession();

  const parsed = myEventInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Revisa los datos del evento e inténtalo de nuevo." };

  try {
    const event = await createMyEvent(parsed.data);
    revalidateEvent(event.slug);
    return { ok: true, event };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "enviar") };
  }
}

/** Edita un evento propio (`PATCH /me/events/:id`): vuelve a `REVIEW` y sale de La Guía hasta aprobarse. */
export async function updateMyEventAction(id: string, input: IMyEventInput): Promise<IMyEventResult> {
  await requireDashboardRole("organizador");

  const parsed = myEventInputSchema.safeParse(input);
  if (typeof id !== "string" || !UUID.test(id) || !parsed.success) {
    return { ok: false, message: "Revisa los datos del evento e inténtalo de nuevo." };
  }

  try {
    const event = await updateMyEvent(id, parsed.data);
    revalidateEvent(event.slug);
    return { ok: true, event };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "guardar") };
  }
}
