import "server-only";
import type { IMyClassified, IMyClassifiedInput } from "@/interfaces/my-classified";
import { apiFetchServer } from "@/lib/api-client";
import { mapClassified, type RawClassified } from "@/lib/api/mappers";
import { toPublicationStatus } from "@/lib/dashboard/status";

/** Lo que devuelven `POST` (dentro de `classified`) y `PATCH /me/classifieds/:id`. */
type RawMyClassified = RawClassified & { status?: string | null; rejectionReason?: string | null };

function mapMyClassified(c: RawMyClassified): IMyClassified {
  const status = toPublicationStatus(c.status, c.expiresAt);
  const reason = status === "rejected" ? c.rejectionReason?.trim() : undefined;
  return { ...mapClassified(c), status, ...(reason ? { rejectionReason: reason } : {}) };
}

/** El tipo va en mayúsculas (`VENDO`); `priceType` viaja tal cual (`fixed`, `free`…), como lo lee `mapClassified`. */
function toBody(data: IMyClassifiedInput) {
  return { ...data, type: data.type.toUpperCase() };
}

/**
 * Crea un aviso propio (`POST /me/classifieds`, cualquier rol). Nace en `REVIEW` y el backend suma
 * AVISADOR a la cuenta en la misma transacción. El JWT no cambia: el rol nuevo se relee de
 * `/auth/me` en el siguiente request.
 */
export async function createMyClassified(data: IMyClassifiedInput): Promise<IMyClassified> {
  const raw = await apiFetchServer<{ classified: RawMyClassified; roles: string[] }>("/me/classifieds", {
    method: "POST",
    body: JSON.stringify(toBody(data)),
  });
  return mapMyClassified(raw.classified);
}

/** Edita un aviso propio (`PATCH /me/classifieds/:id`, AVISADOR); el backend lo deja en `REVIEW`. */
export async function updateMyClassified(id: string, data: IMyClassifiedInput): Promise<IMyClassified> {
  const raw = await apiFetchServer<RawMyClassified>(`/me/classifieds/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(toBody(data)),
  });
  return mapMyClassified(raw);
}
