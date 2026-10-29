/**
 * Traducción del rol del backend (enum `Role` de Prisma, p. ej. `ADMIN`) al `LDCRole` del front.
 *
 * Único lugar donde se mapea. Sin I/O ni React: se puede importar desde Server y Client.
 * Un rol que no está en la tabla, o que no llega, da `null`: el llamador debe denegar.
 */
import { isLDCRole, type LDCRole } from "./roles";

/** Rol del backend → rol del front. Agrega aquí los roles nuevos del enum `Role`. */
const BACKEND_ROLE_MAP: Readonly<Record<string, string>> = {
  ADMIN: "admin",
  COMERCIO: "comercio",
  USUARIO: "usuario",
};

/** Rol del front para el `role` que devuelve el backend, o `null` si es desconocido o no viene. */
export function toLDCRole(backendRole: unknown): LDCRole | null {
  if (typeof backendRole !== "string" || !Object.hasOwn(BACKEND_ROLE_MAP, backendRole)) return null;
  const role = BACKEND_ROLE_MAP[backendRole];
  return isLDCRole(role) ? role : null;
}
