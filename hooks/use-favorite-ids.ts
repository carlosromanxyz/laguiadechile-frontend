"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { IFavoriteIdsResponse, IFavoriteKind } from "@/interfaces/favorite";
import { favoriteKey } from "@/lib/favorites/target";

interface FavoriteIdsState {
  /** `loading` hasta que responde `GET /api/me/favorites/ids` */
  status: "loading" | "ready";
  /** `false` sin sesión: el botón lleva al login */
  authenticated: boolean;
  /** Claves `${kind}:${targetId}` guardadas */
  keys: ReadonlySet<string>;
}

const INITIAL: FavoriteIdsState = { status: "loading", authenticated: false, keys: new Set() };

// Caché en memoria del módulo: un solo fetch por carga de página, compartido por todos los
// botones (cards y hero). Se reinicia con una navegación completa (p. ej. al volver del login).
let state: FavoriteIdsState = INITIAL;
let requested = false;
const listeners = new Set<() => void>();

function emit(next: FavoriteIdsState) {
  state = next;
  for (const listener of listeners) listener();
}

function load() {
  if (requested) return;
  requested = true;
  fetch("/api/me/favorites/ids", { credentials: "same-origin", cache: "no-store" })
    .then((res) => res.json() as Promise<IFavoriteIdsResponse>)
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];
      emit({
        status: "ready",
        authenticated: data.authenticated !== false,
        keys: new Set(items.map((item) => favoriteKey(item.kind, item.targetId))),
      });
    })
    // Si falla, el botón queda usable sin marcas: la server action decide si hay sesión.
    .catch(() => emit({ status: "ready", authenticated: true, keys: new Set() }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => INITIAL;

/** Marca o desmarca un favorito en la caché (tras una server action que salió bien). */
export function setFavoriteSaved(kind: IFavoriteKind, targetId: string, saved: boolean) {
  const keys = new Set(state.keys);
  if (saved) keys.add(favoriteKey(kind, targetId));
  else keys.delete(favoriteKey(kind, targetId));
  emit({ ...state, keys });
}

/** La sesión venció (la server action respondió `reason: "auth"`): sin marcas y sin sesión. */
export function markFavoritesSignedOut() {
  emit({ status: "ready", authenticated: false, keys: new Set() });
}

interface UseFavoriteIdsResult {
  /** Mientras llegan los ids: el botón va `aria-disabled` */
  loading: boolean;
  authenticated: boolean;
  isSaved: (kind: IFavoriteKind, targetId: string) => boolean;
}

/**
 * useFavoriteIds - Favoritos del usuario de la sesión, para pintar `LDCFavoriteButton`.
 *
 * Las fichas de detalle son estáticas, así que el estado se pide en el cliente a
 * `/api/me/favorites/ids` (same-origin, reenvía la cookie). La respuesta se cachea en memoria
 * del módulo: todos los botones de la página comparten un único fetch. En el servidor y en la
 * hidratación el estado es «cargando».
 */
export function useFavoriteIds(): UseFavoriteIdsResult {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isSaved = useCallback(
    (kind: IFavoriteKind, targetId: string) => current.keys.has(favoriteKey(kind, targetId)),
    [current],
  );
  return {
    loading: current.status === "loading",
    authenticated: current.authenticated,
    isSaved,
  };
}
