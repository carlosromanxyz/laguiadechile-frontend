"use server";

import { revalidatePath } from "next/cache";
import type { IMyListingUpdate, IUpdateMyListingResult } from "@/interfaces/my-listing";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { updateMyListing } from "@/services/me/listings";
import { myListingUpdateSchema } from "@/validations/listing-form-schema";

/**
 * Guarda la ficha propia del comercio (`PATCH /me/listings/:id`). El backend la deja en `REVIEW`
 * y la saca de la guía hasta que el admin la apruebe. Devuelve un resultado en vez de lanzar, así
 * el mensaje llega al formulario también en producción.
 */
export async function updateMyListingAction(
  id: string,
  input: IMyListingUpdate,
): Promise<IUpdateMyListingResult> {
  await requireDashboardRole("comercio");

  const parsed = myListingUpdateSchema.safeParse(input);
  if (typeof id !== "string" || !id || !parsed.success) {
    return { ok: false, message: "Revisa los datos de la ficha e inténtalo de nuevo." };
  }

  try {
    const listing = await updateMyListing(id, parsed.data);
    revalidatePath("/dashboard/comercio", "layout");
    revalidatePath("/comercios");
    revalidatePath("/servicios");
    revalidatePath(`/${listing.type}/${listing.slug}`);
    return { ok: true, listing };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 400) return { ok: false, message: `No pudimos guardar: ${e.message}` };
      if (e.status === 401 || e.status === 403) {
        return { ok: false, message: "Tu sesión expiró. Vuelve a ingresar para guardar." };
      }
      if (e.status === 404) return { ok: false, message: "No encontramos esta ficha en tu cuenta." };
    }
    return { ok: false, message: "No pudimos guardar tu ficha. Inténtalo de nuevo en unos minutos." };
  }
}
