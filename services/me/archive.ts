import "server-only";
import type { IDashboardModerationKind } from "@/interfaces/dashboard";
import { apiFetchServer } from "@/lib/api-client";

/** Recurso de `/me/*` de cada tipo de publicación propia. */
const ME_PATHS: Readonly<Record<IDashboardModerationKind, string>> = {
  listing: "listings",
  classified: "classifieds",
  event: "events",
  property: "properties",
  place: "places",
};

/**
 * Archiva o desarchiva una publicación propia (`PATCH /me/{listings,classifieds,events,properties,places}/:id/archive`
 * o `/unarchive`, CLGDC-157) y devuelve el estado con que quedó. Las dos son idempotentes:
 * archivar deja `ARCHIVED`; desarchivar deja `REVIEW` solo si estaba archivada (si no, no cambia).
 * Ajena o inexistente: 404 (`ApiError`).
 */
export async function setMyPublicationArchived(
  kind: IDashboardModerationKind,
  id: string,
  archived: boolean,
): Promise<{ status: string | null }> {
  const raw = await apiFetchServer<{ status?: string | null } | undefined>(
    `/me/${ME_PATHS[kind]}/${encodeURIComponent(id)}/${archived ? "archive" : "unarchive"}`,
    { method: "PATCH" },
  );
  return { status: raw?.status ?? null };
}
