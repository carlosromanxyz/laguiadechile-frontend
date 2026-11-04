import "server-only";
import { cache } from "react";
import type { IMyEvent, IMyEventInput } from "@/interfaces/event";
import { ApiError, apiFetchServer } from "@/lib/api-client";
import { mapEvent, type RawEvent } from "@/lib/api/mappers";
import { toPublicationStatus } from "@/lib/dashboard/status";

/** Lo que devuelven `/me/events`: el evento con su estado efectivo (terminado = `EXPIRED`). */
type RawMyEvent = RawEvent & { status?: string | null; rejectionReason?: string | null };

function mapMyEvent(e: RawMyEvent): IMyEvent {
  const status = toPublicationStatus(e.status);
  const reason = status === "rejected" ? e.rejectionReason?.trim() : undefined;
  return { ...mapEvent(e), status, ...(reason ? { rejectionReason: reason } : {}) };
}

/**
 * Eventos de la cuenta (`GET /me/events`, solo ORGANIZADOR), del último editado al más antiguo.
 * Sin el rol o ante un error de la API, lista vacía (el panel no se cae por eso).
 */
export const getMyEvents = cache(async (): Promise<IMyEvent[]> => {
  try {
    const raw = await apiFetchServer<unknown>("/me/events");
    return Array.isArray(raw) ? (raw as RawMyEvent[]).map(mapMyEvent) : [];
  } catch {
    return [];
  }
});

/** Un evento propio (`GET /me/events/:id`); `null` si no existe o no es de la cuenta. */
export async function getMyEvent(id: string): Promise<IMyEvent | null> {
  try {
    return mapMyEvent(await apiFetchServer<RawMyEvent>(`/me/events/${encodeURIComponent(id)}`));
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400 || e.status === 403)) return null;
    throw e;
  }
}

/**
 * Crea un evento propio (`POST /me/events`, cualquier rol). Nace en `REVIEW` y el backend suma
 * ORGANIZADOR a la cuenta en la misma transacción (`201 { event, roles }`).
 */
export async function createMyEvent(data: IMyEventInput): Promise<IMyEvent> {
  const raw = await apiFetchServer<{ event: RawMyEvent; roles: string[] }>("/me/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapMyEvent(raw.event);
}

/** Edita un evento propio (`PATCH /me/events/:id`, ORGANIZADOR); el backend lo deja en `REVIEW`. */
export async function updateMyEvent(id: string, data: IMyEventInput): Promise<IMyEvent> {
  const raw = await apiFetchServer<RawMyEvent>(`/me/events/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return mapMyEvent(raw);
}
