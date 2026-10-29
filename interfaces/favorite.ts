import type { IDashboardFavoriteKind } from "@/interfaces/dashboard";

/** Tipo de favorito tal como lo nombra la API (`LISTING`, `CLASSIFIED`, `PROPERTY`, `NEWS`). */
export type IFavoriteKind = IDashboardFavoriteKind;

/** Un favorito guardado, sin los datos del destino. */
export interface IFavoriteId {
  kind: IFavoriteKind;
  targetId: string;
}

/**
 * Respuesta de `GET /api/me/favorites/ids` (route handler same-origin).
 * `authenticated: false` cuando no hay sesión (sin cookie o el backend respondió 401).
 */
export interface IFavoriteIdsResponse {
  items: IFavoriteId[];
  authenticated: boolean;
}

/**
 * Resultado de `toggleFavoriteAction`. `reason: "auth"` cuando no hay sesión o venció:
 * el botón lleva al login.
 */
export type IFavoriteToggleResult =
  | { ok: true }
  | { ok: false; reason: "auth" | "invalid" | "error"; message: string };
