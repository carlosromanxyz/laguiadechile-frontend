import type { LDCRole } from "@/lib/auth/roles";
import type { PersonName } from "@/lib/people";

/** Perfil propio (`GET /me`, CLGDC-121), con los roles ya traducidos a `LDCRole`. */
export interface IMyProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** En el orden de `LDC_ROLE_KEYS`; los que el front no conoce se omiten. */
  roles: LDCRole[];
  /** ISO 8601 */
  createdAt: string;
}

/** Cuerpo de `PATCH /me`: nombre y apellido (el correo no se edita). */
export type IMyProfileUpdate = PersonName;

/** Cuerpo de `POST /me/password`. «Repite la nueva» es solo del formulario. */
export interface IMyPasswordChange {
  currentPassword: string;
  newPassword: string;
}

/**
 * Resultado de la server action que guarda el nombre y el apellido (no lanza: el mensaje llega al
 * formulario). Con `field`, el error va en ese campo.
 */
export type IUpdateMyProfileResult =
  | { ok: true; profile: IMyProfile }
  | { ok: false; message: string; field?: "firstName" | "lastName" };

/**
 * Resultado de la server action que cambia la contraseña. Con `field`, el error va en ese campo;
 * sin él, arriba del formulario. `locked`: demasiados intentos (429), el botón queda bloqueado.
 */
export type IChangeMyPasswordResult =
  | { ok: true }
  | { ok: false; message: string; field?: keyof IMyPasswordChange; locked?: boolean };
