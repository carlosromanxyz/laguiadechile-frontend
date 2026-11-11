import "server-only";
import { cache } from "react";
import type { IAdminPlace, IMyPlace, IMyPlaceUpsert } from "@/interfaces/place";
import { ApiError, apiFetchServer } from "@/lib/api-client";
import { toPublicationStatus } from "@/lib/dashboard/status";

/** Lo que devuelven `/me/places` (CLGDC-209): el lugar como lo guarda la API, con su estado. */
type RawMyPlace = Omit<IAdminPlace, "status" | "rejectionReason"> & {
  status?: string | null;
  rejectionReason?: string | null;
};

function mapMyPlace(p: RawMyPlace): IMyPlace {
  const { status: rawStatus, rejectionReason: rawReason, ...rest } = p;
  const status = toPublicationStatus(rawStatus);
  const reason = status === "rejected" ? rawReason?.trim() : undefined;
  return { ...rest, gallery: rest.gallery ?? [], status, ...(reason ? { rejectionReason: reason } : {}) };
}

/**
 * Lugares de la cuenta (`GET /me/places`, solo COLABORADOR), del último editado al más antiguo.
 * Sin el rol o ante un error de la API, lista vacía (el panel no se cae por eso).
 */
export const getMyPlaces = cache(async (): Promise<IMyPlace[]> => {
  try {
    const raw = await apiFetchServer<unknown>("/me/places");
    return Array.isArray(raw) ? (raw as RawMyPlace[]).map(mapMyPlace) : [];
  } catch {
    return [];
  }
});

/** Un lugar propio (`GET /me/places/:id`); `null` si no existe o no es de la cuenta. */
export async function getMyPlace(id: string): Promise<IMyPlace | null> {
  try {
    return mapMyPlace(await apiFetchServer<RawMyPlace>(`/me/places/${encodeURIComponent(id)}`));
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400 || e.status === 403)) return null;
    throw e;
  }
}

/**
 * Crea un lugar propio (`POST /me/places`, cualquier rol). Nace en `REVIEW` y el backend suma
 * COLABORADOR a la cuenta en la misma transacción (`201 { place, roles }`).
 */
export async function createMyPlace(data: IMyPlaceUpsert): Promise<IMyPlace> {
  const raw = await apiFetchServer<{ place: RawMyPlace; roles: string[] }>("/me/places", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapMyPlace(raw.place);
}

/** Edita un lugar propio (`PATCH /me/places/:id`, COLABORADOR); el backend lo deja en `REVIEW`. */
export async function updateMyPlace(id: string, data: IMyPlaceUpsert): Promise<IMyPlace> {
  const raw = await apiFetchServer<RawMyPlace>(`/me/places/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return mapMyPlace(raw);
}
