import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { IFavoriteId, IFavoriteIdsResponse } from "@/interfaces/favorite";
import { ApiError, AUTH_COOKIE, apiFetchServer } from "@/lib/api-client";
import { isValidFavoriteTarget } from "@/lib/favorites/target";

export const dynamic = "force-dynamic";

/** Respuesta por usuario: ni el navegador ni un proxy deben guardarla. */
function reply(body: IFavoriteIdsResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

/** Deja solo los pares `{ kind, targetId }` válidos (no reenvía nada más del backend). */
function sanitize(payload: unknown): IFavoriteId[] {
  const items = (payload as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const { kind, targetId } = (item ?? {}) as { kind?: unknown; targetId?: unknown };
    return isValidFavoriteTarget(kind, targetId)
      ? [{ kind: kind as IFavoriteId["kind"], targetId: targetId as string }]
      : [];
  });
}

/**
 * GET /api/me/favorites/ids - Ids de los favoritos del usuario de la sesión, para pintar el
 * corazón de `LDCFavoriteButton` en páginas estáticas (`useFavoriteIds`).
 *
 * Reenvía la cookie (como Bearer) a `GET /me/favorites/ids` del backend. Sin cookie o con 401,
 * responde 200 `{ items: [], authenticated: false }`; si el backend falla, 502 con `items: []`.
 */
export async function GET() {
  const jar = await cookies();
  if (!jar.has(AUTH_COOKIE)) return reply({ items: [], authenticated: false });

  try {
    const payload = await apiFetchServer<unknown>("/me/favorites/ids");
    return reply({ items: sanitize(payload), authenticated: true });
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    if (status === 401) return reply({ items: [], authenticated: false });
    return reply({ items: [], authenticated: true }, 502);
  }
}
