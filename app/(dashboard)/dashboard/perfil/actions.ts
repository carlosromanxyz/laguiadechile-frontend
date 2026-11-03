"use server";

import { revalidatePath } from "next/cache";
import type {
  IChangeMyPasswordResult,
  IMyPasswordChange,
  IMyProfileUpdate,
  IUpdateMyProfileResult,
} from "@/interfaces/profile";
import { changeMyPassword, updateMyProfile } from "@/lib/api/me-profile";
import { ApiError } from "@/lib/api-client";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { PASSWORD_MAX_BYTES_MESSAGE } from "@/validations/password-bytes";
import { passwordChangeInputSchema, profileDetailsSchema } from "@/validations/profile-form-schema";

const SESSION_EXPIRED = "Tu sesión expiró. Vuelve a ingresar para guardar.";

/**
 * Guarda el nombre (`PATCH /me`). Revalida el layout del panel para que el pie del menú muestre
 * el nombre nuevo. Devuelve un resultado en vez de lanzar, así el mensaje llega al formulario.
 */
export async function updateMyProfileAction(input: IMyProfileUpdate): Promise<IUpdateMyProfileResult> {
  await requireDashboardSession();

  const parsed = profileDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, field: "name", message: parsed.error.issues[0]?.message ?? "Revisa tu nombre." };
  }

  try {
    const profile = await updateMyProfile(parsed.data);
    revalidatePath("/dashboard", "layout");
    return { ok: true, profile };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 400) return { ok: false, field: "name", message: "Revisa tu nombre: usa entre 1 y 100 caracteres." };
      if (e.status === 401 || e.status === 403) return { ok: false, message: SESSION_EXPIRED };
    }
    return { ok: false, message: "No pudimos guardar tu nombre. Inténtalo de nuevo en unos minutos." };
  }
}

/**
 * Cambia la contraseña (`POST /me/password`). El 400 del backend va al campo que lo causó (la
 * actual errónea o la nueva igual a la actual); el 429 bloquea el formulario.
 */
export async function changeMyPasswordAction(input: IMyPasswordChange): Promise<IChangeMyPasswordResult> {
  await requireDashboardSession();

  const parsed = passwordChangeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revisa las contraseñas e inténtalo de nuevo." };
  }

  try {
    await changeMyPassword(parsed.data);
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 400) {
        if (/actual no es correcta/i.test(e.message)) {
          return { ok: false, field: "currentPassword", message: "La contraseña actual no es correcta." };
        }
        if (/distinta de la actual/i.test(e.message)) {
          return { ok: false, field: "newPassword", message: "La contraseña nueva debe ser distinta de la actual." };
        }
        return {
          ok: false,
          field: "newPassword",
          message: `Usa al menos 8 caracteres. ${PASSWORD_MAX_BYTES_MESSAGE}`,
        };
      }
      if (e.status === 429) {
        return {
          ok: false,
          locked: true,
          message: "Hiciste demasiados intentos. Espera 15 minutos y vuelve a intentarlo.",
        };
      }
      if (e.status === 401 || e.status === 403) return { ok: false, message: SESSION_EXPIRED };
    }
    return { ok: false, message: "No pudimos cambiar tu contraseña. Inténtalo de nuevo en unos minutos." };
  }
}
