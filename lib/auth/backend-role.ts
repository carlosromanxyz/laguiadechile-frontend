/**
 * Traducción de los roles del backend (enum `Role` de Prisma, p. ej. `ADMIN`) a `LDCRole` del front.
 *
 * Único lugar donde se mapea. Sin I/O ni React: se puede importar desde Server y Client.
 * Los roles que no están en la tabla se ignoran; sin ninguno conocido, lista vacía: el llamador
 * debe denegar.
 */
import { isLDCRole, LDC_ROLE_KEYS, type LDCRole } from "./roles";

/** Rol del backend → rol del front. Agrega aquí los roles nuevos del enum `Role`. */
const BACKEND_ROLE_MAP: Readonly<Record<string, string>> = {
  ADMIN: "admin",
  AVISADOR: "avisador",
  COMERCIO: "comercio",
  SERVICIO: "servicio",
  USUARIO: "usuario",
};

/**
 * Roles del front para los `roles` que devuelve el backend (`/auth/me`, login y registro), sin
 * repetir y en el orden de `LDC_ROLE_KEYS`. Si no llega un arreglo, lista vacía.
 */
export function toLDCRoles(backendRoles: unknown): LDCRole[] {
  if (!Array.isArray(backendRoles)) return [];
  const found = new Set<LDCRole>();
  for (const r of backendRoles) {
    if (typeof r !== "string" || !Object.hasOwn(BACKEND_ROLE_MAP, r)) continue;
    const role = BACKEND_ROLE_MAP[r];
    if (isLDCRole(role)) found.add(role);
  }
  return LDC_ROLE_KEYS.filter((r) => found.has(r));
}
