"use server";

import { revalidatePath } from "next/cache";
import type { ICreateMyListingResult, IMyListingCreate } from "@/interfaces/my-listing";
import { DASHBOARD_PUBLISH_ROLES } from "@/config/dashboard-navigation";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { createMyListing } from "@/services/me/listings";
import { myListingCreateSchema } from "@/validations/listing-form-schema";

/**
 * Crea la ficha propia (`POST /me/listings`). Nace en `REVIEW`; el backend suma a la cuenta el rol
 * comercio o servicio según el tipo. Se revalida todo el panel (`layout`) para que el layout y el
 * menú relean los roles desde `/auth/me`. Devuelve un resultado en vez de lanzar, así el mensaje llega al
 * formulario también en producción; la redirección a `/dashboard/comercio` la hace el formulario
 * después del toast.
 */
export async function createMyListingAction(input: IMyListingCreate): Promise<ICreateMyListingResult> {
  await requireDashboardRole(DASHBOARD_PUBLISH_ROLES);

  const parsed = myListingCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de la ficha e inténtalo de nuevo." };
  }

  try {
    const listing = await createMyListing(parsed.data);
    revalidatePath("/dashboard", "layout");
    return { ok: true, listing };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 400) return { ok: false, message: `No pudimos enviarla: ${e.message}` };
      if (e.status === 401) return { ok: false, message: "Tu sesión expiró. Vuelve a ingresar para enviarla." };
      if (e.status === 403) return { ok: false, message: "Tu cuenta no puede publicar fichas." };
      if (e.status === 429) {
        return { ok: false, message: "Ya enviaste varias fichas hoy. Vuelve a intentarlo mañana." };
      }
    }
    return { ok: false, message: "No pudimos enviar tu ficha. Inténtalo de nuevo en unos minutos." };
  }
}
