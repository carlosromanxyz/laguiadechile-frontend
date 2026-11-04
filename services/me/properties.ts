import "server-only";
import { cache } from "react";
import type { IAdminProperty } from "@/interfaces/admin-catalog";
import type { IMyProperty, IMyPropertyInput } from "@/interfaces/my-property";
import { apiFetchServer } from "@/lib/api-client";
import { toPublicationStatus } from "@/lib/dashboard/status";

/** Lo que devuelve `/me/properties`: la propiedad con su estado de moderación. */
type RawMyProperty = Omit<IAdminProperty, "status"> & { status?: string | null; rejectionReason?: string | null };

function mapMyProperty(p: RawMyProperty): IMyProperty {
  const { status: rawStatus, rejectionReason, ...rest } = p;
  const status = toPublicationStatus(rawStatus);
  const reason = status === "rejected" ? rejectionReason?.trim() : undefined;
  return { ...rest, status, ...(reason ? { rejectionReason: reason } : {}) };
}

/**
 * Propiedades de la cuenta (`GET /me/properties`, exige PROPIETARIO), la más reciente primero.
 * Ante un error de la API, lista vacía.
 */
export const getMyProperties = cache(async (): Promise<IMyProperty[]> => {
  try {
    const data = await apiFetchServer<unknown>("/me/properties");
    return Array.isArray(data) ? (data as RawMyProperty[]).map(mapMyProperty) : [];
  } catch {
    return [];
  }
});

/**
 * Crea una propiedad propia (`POST /me/properties`, cualquier rol). Nace en `REVIEW` y el backend
 * suma PROPIETARIO a la cuenta en la misma transacción; el rol se relee de `/auth/me`.
 */
export async function createMyProperty(data: IMyPropertyInput): Promise<IMyProperty> {
  const raw = await apiFetchServer<{ property: RawMyProperty; roles: string[] }>("/me/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapMyProperty(raw.property);
}

/** Edita una propiedad propia (`PATCH /me/properties/:id`, PROPIETARIO); vuelve a `REVIEW`. */
export async function updateMyProperty(id: string, data: IMyPropertyInput): Promise<IMyProperty> {
  const raw = await apiFetchServer<RawMyProperty>(`/me/properties/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return mapMyProperty(raw);
}
