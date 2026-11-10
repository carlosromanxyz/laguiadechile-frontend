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
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { PASSWORD_MAX_BYTES_MESSAGE } from "@/validations/password-bytes";
import { passwordChangeInputSchema, profileDetailsSchema } from "@/validations/profile-form-schema";

const SESSION_EXPIRED = "Tu sesión expiró. Vuelve a ingresar para guardar.";

/** Error de cada campo cuando el backend rechaza el valor (400). */
const FIELD_ERROR = {
  firstName: "Revisa tu nombre: usa entre 2 y 80 caracteres.",
  lastName: "Revisa tu apellido: usa entre 2 y 80 caracteres.",
} as const;

/**
 * Campo que rechazó el 400 de `PATCH /me`. class-validator responde `message: string[]` y cada
 * mensaje empieza con la propiedad («lastName must be longer than…»). Va a `lastName` solo si
 * algún mensaje empieza con `lastName` y ninguno con `firstName`; en cualquier otro caso (ambos
 * campos, mensaje sin prefijo o formato inesperado), al primero del formulario, `firstName`.
 */
function rejectedNameField(e: ApiError): "firstName" | "lastName" {
  const raw = (e.payload as { message?: unknown } | undefined)?.message;
  const messages = (Array.isArray(raw) ? raw : [raw ?? e.message]).filter(
    (m): m is string => typeof m === "string",
  );
  const lastName = messages.some((m) => /^lastName\b/.test(m));
  const firstName = messages.some((m) => /^firstName\b/.test(m));
  return lastName && !firstName ? "lastName" : "firstName";
}

/**
 * Guarda el nombre y el apellido (`PATCH /me`). Revalida el layout del panel para que el pie del
 * menú muestre el nombre nuevo. Devuelve un resultado en vez de lanzar, así el mensaje llega al
 * formulario, en el campo que lo causó.
 */
export async function updateMyProfileAction(input: IMyProfileUpdate): Promise<IUpdateMyProfileResult> {
  await requireDashboardSession();

  const parsed = profileDetailsSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0] === "lastName" ? "lastName" : "firstName";
    return { ok: false, field, message: issue?.message ?? FIELD_ERROR[field] };
  }

  try {
    const profile = await updateMyProfile(parsed.data);
    revalidatePath("/dashboard", "layout");
    return { ok: true, profile };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 400) {
        const field = rejectedNameField(e);
        return { ok: false, field, message: FIELD_ERROR[field] };
      }
      if (e.status === 401 || e.status === 403) return { ok: false, message: SESSION_EXPIRED };
    }
    return { ok: false, message: "No pudimos guardar tu nombre y apellido. Inténtalo de nuevo en unos minutos." };
  }
}

/**
 * Cambia la contraseña (`POST /me/password`). El 400 del backend va al campo que lo causó (la
 * actual errónea o la nueva igual a la actual); el 409 (la contraseña cambió en paralelo) pide
 * volver a iniciar sesión; el 429 bloquea el formulario. Si el backend devuelve un token nuevo (los
 * anteriores quedan inválidos), reemplaza la cookie de sesión en el servidor con las mismas opciones
 * que el login, para que la sesión siga abierta; el token nunca vuelve al cliente.
 */
export async function changeMyPasswordAction(input: IMyPasswordChange): Promise<IChangeMyPasswordResult> {
  await requireDashboardSession();

  const parsed = passwordChangeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revisa las contraseñas e inténtalo de nuevo." };
  }

  try {
    const accessToken = await changeMyPassword(parsed.data);
    if (accessToken) await setSessionCookie(accessToken);
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
      if (e.status === 409) {
        return {
          ok: false,
          message: "Tu contraseña cambió desde otra sesión mientras guardabas. Vuelve a iniciar sesión.",
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
