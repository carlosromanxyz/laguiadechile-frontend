/**
 * Rutas del panel por rol.
 *
 * El rol (`LDCRole`) y su configuración viven en `lib/auth/roles.ts`; aquí solo lo propio del
 * panel. Sin `server-only`: lo usan el proxy, los layouts y los formularios de acceso (cliente).
 */
import type { LDCRole } from "@/lib/auth/roles";

/** Inicio del panel de cada rol: `/dashboard/{admin|comercio|usuario}`. */
export function getRoleHome(role: LDCRole): string {
  return `/dashboard/${role}`;
}
