"use server";

import { revalidatePath } from "next/cache";
import type { IMyClassifiedInput, IMyClassifiedResult } from "@/interfaces/my-classified";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole, requireDashboardSession } from "@/lib/dashboard/session";
import { createMyClassified, updateMyClassified } from "@/services/me/classifieds";
import { myClassifiedInputSchema } from "@/validations/classified-form-schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown, verb: "enviar" | "guardar"): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return `No pudimos ${verb} tu aviso: revisa los datos y las fotos e inténtalo de nuevo.`;
  if (status === 401) return `Tu sesión expiró. Vuelve a ingresar para ${verb} tu aviso.`;
  if (status === 403) return "Tu cuenta no puede publicar avisos.";
  if (status === 404) return "No encontramos este aviso en tu cuenta.";
  if (status === 429) return "Ya enviaste varios avisos en la última hora. Vuelve a intentarlo más tarde.";
  return `No pudimos ${verb} tu aviso. Inténtalo de nuevo en unos minutos.`;
}

/** Refresca el panel (menú y «Mis avisos») y lo público donde el aviso aparecía. */
function revalidateClassified(slug: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/avisos");
  revalidatePath(`/aviso/${slug}`);
}

/**
 * Crea un aviso propio (`POST /me/classifieds`). Entra cualquier cuenta con sesión: el backend deja
 * el aviso en `REVIEW` y suma AVISADOR a los roles en la misma transacción. Se revalida todo el panel
 * (`layout`) para que el menú relea los roles desde `/auth/me` y aparezca «Mis avisos». La
 * redirección la hace el formulario después del toast.
 */
export async function createMyClassifiedAction(input: IMyClassifiedInput): Promise<IMyClassifiedResult> {
  await requireDashboardSession();

  const parsed = myClassifiedInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Revisa los datos del aviso e inténtalo de nuevo." };

  try {
    const classified = await createMyClassified(parsed.data);
    revalidateClassified(classified.slug);
    return { ok: true, classified };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "enviar") };
  }
}

/** Edita un aviso propio (`PATCH /me/classifieds/:id`): vuelve a `REVIEW` y sale de La Guía hasta aprobarse. */
export async function updateMyClassifiedAction(
  id: string,
  input: IMyClassifiedInput,
): Promise<IMyClassifiedResult> {
  await requireDashboardRole("avisador");

  const parsed = myClassifiedInputSchema.safeParse(input);
  if (typeof id !== "string" || !UUID.test(id) || !parsed.success) {
    return { ok: false, message: "Revisa los datos del aviso e inténtalo de nuevo." };
  }

  try {
    const classified = await updateMyClassified(id, parsed.data);
    revalidateClassified(classified.slug);
    return { ok: true, classified };
  } catch (e) {
    return { ok: false, message: friendlyError(e, "guardar") };
  }
}
