"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { isLDCRole, type LDCRole } from "@/lib/auth/roles";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { adminUsersService } from "@/services/admin/users";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Texto fijo según el status de la API (nunca el mensaje crudo del backend). Con una lista ya
 * validada, un 400 al quitar ADMIN solo puede ser la regla del backend: nadie se quita ADMIN a sí
 * mismo y siempre queda al menos un administrador (`AdminUsersService.updateRoles`).
 */
function friendlyError(e: unknown, self: boolean, removesAdmin: boolean): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400 && removesAdmin) {
    return self
      ? "No puedes quitarte el rol Administrador a ti mismo."
      : "Debe quedar al menos una cuenta con el rol Administrador.";
  }
  if (status === 400) return "Revisa los roles e inténtalo de nuevo.";
  if (status === 401 || status === 403) return "No tienes permiso.";
  if (status === 404) return "Esa cuenta ya no existe.";
  if (status === 429) return "Demasiados intentos, espera un momento.";
  return "No pudimos guardar los roles.";
}

/**
 * Reemplaza los roles de una cuenta desde «Usuarios» del admin (`PATCH /admin/users/:id/roles`,
 * CLGDC-120, CLGDC-127). `usuario` se suma siempre. Un admin no puede quitarse `admin`: la UI lo
 * impide y esta acción lo corta antes de llamar a la API, que de todos modos responde 400.
 */
export async function setAdminUserRolesAction(
  id: string,
  roles: LDCRole[],
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, message: "Cuenta inválida." };
  if (!Array.isArray(roles) || !roles.every((r) => typeof r === "string" && isLDCRole(r))) {
    return { ok: false, message: "Roles inválidos." };
  }
  const wanted: LDCRole[] = [...new Set<LDCRole>([...roles, "usuario"])];
  const removesAdmin = !wanted.includes("admin");
  const me = await getCurrentUser();
  const self = me?.id === id;
  if (self && removesAdmin) {
    return { ok: false, message: "No puedes quitarte el rol Administrador a ti mismo." };
  }

  try {
    await adminUsersService.setRoles(id, wanted);
  } catch (e) {
    return { ok: false, message: friendlyError(e, self, removesAdmin) };
  }

  revalidatePath("/dashboard/admin/usuarios");
  return { ok: true };
}
