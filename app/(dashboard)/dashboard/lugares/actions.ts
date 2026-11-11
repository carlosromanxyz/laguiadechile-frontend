"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole, requireDashboardSession } from "@/lib/dashboard/session";
import { createMyPlace, getMyPlace, updateMyPlace } from "@/services/me/places";
import {
  myPlaceFormSchema,
  toMyPlacePayload,
  type LDCMyPlaceFormValues,
} from "@/validations/place-form-schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9-]{1,200}$/;
const INVALID = { ok: false, message: "Revisa los datos del lugar e inténtalo de nuevo." } as const;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown, verb: "enviar" | "guardar"): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return `No pudimos ${verb} tu lugar: revisa los datos y las fotos e inténtalo de nuevo.`;
  if (status === 401) return `Tu sesión expiró. Vuelve a ingresar para ${verb} tu lugar.`;
  if (status === 403) return "Tu cuenta no puede publicar lugares.";
  if (status === 404) return "No encontramos este lugar en tu cuenta.";
  if (status === 429) return "Ya enviaste varios lugares en la última hora. Vuelve a intentarlo más tarde.";
  return `No pudimos ${verb} tu lugar. Inténtalo de nuevo en unos minutos.`;
}

/** Refresca el panel (menú y «Mis lugares») y lo público donde el lugar aparecía. */
function revalidatePlace(slug: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/lugares");
  if (SLUG.test(slug)) revalidatePath(`/lugar/${slug}`);
}

/**
 * Crea un lugar propio (`POST /me/places`, CLGDC-209). Entra cualquier cuenta con sesión: el
 * backend deja el lugar en `REVIEW` y suma COLABORADOR a los roles en la misma transacción. Se
 * revalida todo el panel (`layout`) para que el menú relea los roles y aparezca «Mis lugares». La
 * redirección la hace el formulario después del toast.
 */
export async function createMyPlaceAction(values: LDCMyPlaceFormValues): Promise<IDashboardActionResult> {
  await requireDashboardSession();
  const parsed = myPlaceFormSchema.safeParse(values);
  if (!parsed.success) return INVALID;
  try {
    const place = await createMyPlace(toMyPlacePayload(parsed.data));
    revalidatePlace(place.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "enviar") };
  }
}

/**
 * Edita un lugar propio (`PATCH /me/places/:id`): vuelve a `REVIEW` y sale de La Guía hasta
 * aprobarse. Lee el guardado (solo los de la cuenta) para reenviar su HTML si la descripción no
 * cambió.
 */
export async function updateMyPlaceAction(id: string, values: LDCMyPlaceFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("colaborador");
  const parsed = myPlaceFormSchema.safeParse(values);
  if (typeof id !== "string" || !UUID.test(id) || !parsed.success) return INVALID;
  try {
    const current = await getMyPlace(id);
    if (!current) return { ok: false, message: "No encontramos este lugar en tu cuenta." };
    const place = await updateMyPlace(id, toMyPlacePayload(parsed.data, current.description));
    revalidatePlace(place.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "guardar") };
  }
}
