"use server";

import { revalidatePath } from "next/cache";
import type { IMyPropertyResult } from "@/interfaces/my-property";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole, requireDashboardSession } from "@/lib/dashboard/session";
import { createMyProperty, updateMyProperty } from "@/services/me/properties";
import {
  myPropertyFormSchema,
  toMyPropertyPayload,
  type LDCPropertyFormValues,
} from "@/validations/admin-catalog-schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INVALID = "Revisa los datos de la propiedad e inténtalo de nuevo.";

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown, verb: "enviar" | "guardar"): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return `No pudimos ${verb} tu propiedad: revisa los datos y las fotos e inténtalo de nuevo.`;
  if (status === 401) return `Tu sesión expiró. Vuelve a ingresar para ${verb} tu propiedad.`;
  if (status === 403) return "Tu cuenta no puede publicar propiedades.";
  if (status === 404) return "No encontramos esta propiedad en tu cuenta.";
  if (status === 429) return "Ya enviaste varias propiedades en la última hora. Vuelve a intentarlo más tarde.";
  return `No pudimos ${verb} tu propiedad. Inténtalo de nuevo en unos minutos.`;
}

/** Refresca el panel (menú y «Mis propiedades») y lo público donde la propiedad aparecía. */
function revalidateProperty(slug: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedad/${slug}`);
}

/**
 * Crea una propiedad propia (`POST /me/properties`). Entra cualquier cuenta con sesión: el backend
 * la deja en `REVIEW` y suma PROPIETARIO en la misma transacción. Se revalida todo el panel
 * (`layout`) para que el menú relea los roles y aparezca «Mis propiedades».
 */
export async function createMyPropertyAction(values: LDCPropertyFormValues): Promise<IMyPropertyResult> {
  await requireDashboardSession();
  const parsed = myPropertyFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: INVALID };
  try {
    const property = await createMyProperty(toMyPropertyPayload(parsed.data));
    revalidateProperty(property.slug);
    return { ok: true, property };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "enviar") };
  }
}

/** Edita una propiedad propia (`PATCH /me/properties/:id`): vuelve a `REVIEW` y sale de La Guía hasta aprobarse. */
export async function updateMyPropertyAction(
  id: string,
  values: LDCPropertyFormValues,
): Promise<IMyPropertyResult> {
  await requireDashboardRole("propietario");
  const parsed = myPropertyFormSchema.safeParse(values);
  if (typeof id !== "string" || !UUID.test(id) || !parsed.success) return { ok: false, message: INVALID };
  try {
    const property = await updateMyProperty(id, toMyPropertyPayload(parsed.data));
    revalidateProperty(property.slug);
    return { ok: true, property };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "guardar") };
  }
}
