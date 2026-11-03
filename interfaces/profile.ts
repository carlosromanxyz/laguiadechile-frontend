import type { LDCRole } from "@/lib/auth/roles";

/** Perfil propio (`GET /me`, CLGDC-121), con los roles ya traducidos a `LDCRole`. */
export interface IMyProfile {
  id: string;
  email: string;
  name: string;
  /** En el orden de `LDC_ROLE_KEYS`; los que el front no conoce se omiten. */
  roles: LDCRole[];
  /** ISO 8601 */
  createdAt: string;
}

/** Cuerpo de `PATCH /me`: solo el nombre (el correo no se edita). */
export interface IMyProfileUpdate {
  name: string;
}

/** Cuerpo de `POST /me/password`. «Repite la nueva» es solo del formulario. */
export interface IMyPasswordChange {
  currentPassword: string;
  newPassword: string;
}

/** Resultado de la server action que guarda el nombre (no lanza: el mensaje llega al formulario). */
export type IUpdateMyProfileResult =
  | { ok: true; profile: IMyProfile }
  | { ok: false; message: string; field?: "name" };

/**
 * Resultado de la server action que cambia la contraseña. Con `field`, el error va en ese campo;
 * sin él, arriba del formulario. `locked`: demasiados intentos (429), el botón queda bloqueado.
 */
export type IChangeMyPasswordResult =
  | { ok: true }
  | { ok: false; message: string; field?: keyof IMyPasswordChange; locked?: boolean };
