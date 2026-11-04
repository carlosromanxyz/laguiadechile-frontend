"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult, IDashboardModerationKind } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import type { LDCRole } from "@/lib/auth/roles";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { setMyPublicationArchived } from "@/services/me/archive";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9-]{1,200}$/;

/** Rol que pide `/me/*` de cada tipo (`@Roles` del backend). */
const ROLES: Readonly<Record<IDashboardModerationKind, readonly LDCRole[]>> = {
  listing: ["comercio", "servicio"],
  classified: ["avisador"],
  event: ["organizador"],
  property: ["propietario"],
};

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/** Refresca el panel y lo público donde la publicación aparece (sale de La Guía o vuelve a revisión). */
function revalidateAfterArchive(kind: IDashboardModerationKind, slug: unknown) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  const okSlug = typeof slug === "string" && SLUG.test(slug);
  if (kind === "listing") {
    revalidatePath("/comercios");
    revalidatePath("/servicios");
    if (okSlug) {
      revalidatePath(`/comercio/${slug}`);
      revalidatePath(`/servicio/${slug}`);
    }
  } else if (kind === "classified") {
    revalidatePath("/avisos");
    if (okSlug) revalidatePath(`/aviso/${slug}`);
  } else if (kind === "property") {
    revalidatePath("/propiedades");
    if (okSlug) revalidatePath(`/propiedad/${slug}`);
  } else if (okSlug) {
    // TODO(CLGDC-139): confirmar la ruta pública del evento cuando existan las páginas de eventos.
    revalidatePath(`/evento/${slug}`);
  }
}

async function toggle(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
  archived: boolean,
): Promise<IDashboardActionResult> {
  if (!Object.hasOwn(ROLES, kind)) return { ok: false, message: "Elemento inválido." };
  await requireDashboardRole(ROLES[kind]);
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, message: "Elemento inválido." };

  let status: string | null;
  try {
    ({ status } = await setMyPublicationArchived(kind, id, archived));
  } catch (e) {
    return { ok: false, message: friendlyError(e) };
  }
  revalidateAfterArchive(kind, slug);
  // Desarchivar no cambia nada si no estaba archivada (la API es idempotente): se dice.
  if (!archived && status !== "REVIEW") return { ok: false, message: "No había nada que desarchivar" };
  return { ok: true };
}

/**
 * Archiva una publicación propia (el «borrar» del dueño, CLGDC-157): sale de La Guía y de los
 * favoritos, sin borrarse. Ficha (comercio o servicio), aviso (avisador), evento (organizador) o
 * propiedad (propietario).
 */
export async function archiveMyPublicationAction(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
): Promise<IDashboardActionResult> {
  return toggle(kind, id, slug, true);
}

/** Desarchiva una publicación propia: vuelve a revisión (`REVIEW`), aunque antes estuviera publicada. */
export async function unarchiveMyPublicationAction(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
): Promise<IDashboardActionResult> {
  return toggle(kind, id, slug, false);
}
