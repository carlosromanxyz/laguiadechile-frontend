import type { IFavoriteKind } from "@/interfaces/favorite";

/** Tipos que acepta `POST /me/favorites` y `DELETE /me/favorites/:kind/:id`. */
export const FAVORITE_KINDS: readonly IFavoriteKind[] = ["LISTING", "CLASSIFIED", "PROPERTY", "NEWS"];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Valida un favorito antes de mandarlo a la API: `kind` de la lista y `targetId` UUID.
 * La comparten la server action pública (`lib/favorites/actions.ts`) y la del panel
 * (`dashboard/usuario/favoritos/actions.ts`), y el route handler de ids para filtrar la respuesta.
 */
export function isValidFavoriteTarget(kind: unknown, targetId: unknown): boolean {
  return (
    typeof kind === "string" &&
    (FAVORITE_KINDS as readonly string[]).includes(kind) &&
    typeof targetId === "string" &&
    UUID.test(targetId)
  );
}

/** Clave de un favorito en la caché del cliente: `${kind}:${targetId}`. */
export function favoriteKey(kind: IFavoriteKind, targetId: string): string {
  return `${kind}:${targetId}`;
}
