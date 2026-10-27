/**
 * Rutas del panel por rol y simulación del rol (solo front).
 *
 * El rol (`LDCRole`) y su configuración viven en `lib/auth/roles.ts`; aquí solo lo propio del
 * panel. Sin `server-only`: lo usan el proxy, los layouts y el cambiador de rol (cliente).
 */
import type { LDCRole } from "@/lib/auth/roles";

/** Inicio del panel de cada rol: `/dashboard/{admin|comercio|usuario}`. */
export function getRoleHome(role: LDCRole): string {
  return `/dashboard/${role}`;
}

/** Cookie con el rol simulado (`admin`, `comercio` o `usuario`). */
export const MOCK_ROLE_COOKIE = "ldc-mock-role";

/**
 * Simulación de roles activa: `NEXT_PUBLIC_MOCK_ROLES=true` y fuera de producción.
 * Next incrusta ambas variables en el build, así que vale igual en el proxy, el servidor y el
 * cliente; un build de producción (`next build`) nunca la activa, aunque traiga la bandera.
 */
export function isMockRolesEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MOCK_ROLES === "true";
}
