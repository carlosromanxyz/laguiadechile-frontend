"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult, IDashboardModerationKind } from "@/interfaces/dashboard";
import { ApiError, apiFetchServer } from "@/lib/api-client";
import { requireDashboardRole } from "@/lib/dashboard/session";

const KINDS: readonly IDashboardModerationKind[] = ["listing", "classified"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9-]{1,200}$/;

function isValid(kind: unknown, id: unknown): kind is IDashboardModerationKind {
  return KINDS.includes(kind as IDashboardModerationKind) && typeof id === "string" && UUID.test(id);
}


/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/** Refresca el panel y la página pública del elemento (vuelve a la guía o sale de ella). */
function revalidateAfterModeration(kind: IDashboardModerationKind, slug: unknown) {
  revalidatePath("/dashboard", "layout");
  if (typeof slug !== "string" || !SLUG.test(slug)) return;
  if (kind === "listing") {
    revalidatePath(`/comercio/${slug}`);
    revalidatePath(`/servicio/${slug}`);
  } else {
    revalidatePath(`/aviso/${slug}`);
  }
}

async function moderate(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
  verb: "approve" | "reject",
  reason?: string,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isValid(kind, id)) return { ok: false, message: "Elemento inválido." };
  const body = verb === "reject" && reason?.trim() ? { reason: reason.trim().slice(0, 500) } : {};
  try {
    await apiFetchServer(`/admin/moderation/${kind}/${id}/${verb}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (e) {
    return { ok: false, message: friendlyError(e) };
  }
  revalidateAfterModeration(kind, slug);
  return { ok: true };
}

/** Aprueba una ficha o un aviso en revisión: queda PUBLISHED. */
export async function approveModerationAction(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
): Promise<IDashboardActionResult> {
  return moderate(kind, id, slug, "approve");
}

/** Rechaza una ficha o un aviso en revisión: queda REJECTED (el motivo es opcional). */
export async function rejectModerationAction(
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
  reason?: string,
): Promise<IDashboardActionResult> {
  return moderate(kind, id, slug, "reject", typeof reason === "string" ? reason : undefined);
}
