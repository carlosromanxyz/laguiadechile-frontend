import "server-only";
/**
 * Resúmenes del inicio del panel (CLGDC-192), con la sesión del request: `GET /admin/stats` (admin)
 * y `GET /me/summary` (cualquier cuenta). Una sola llamada cada uno, con los conteos ya hechos en la
 * base. Ante un error, `null`: el inicio muestra el resto y no se cae.
 */
import { cache } from "react";
import type { IAdminStats, IMySummary } from "@/interfaces/dashboard-summary";
import { apiFetchServer } from "@/lib/api-client";

export const getAdminStats = cache(async (): Promise<IAdminStats | null> => {
  try {
    return await apiFetchServer<IAdminStats>("/admin/stats");
  } catch {
    return null;
  }
});

export const getMySummary = cache(async (): Promise<IMySummary | null> => {
  try {
    return await apiFetchServer<IMySummary>("/me/summary");
  } catch {
    return null;
  }
});
