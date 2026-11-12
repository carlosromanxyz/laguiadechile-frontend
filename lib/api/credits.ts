import "server-only";
import type { IImageCredit } from "@/interfaces/image-credit";
import { apiGet } from "./server-fetch";

/** Los créditos cambian solo cuando se regeneran los JSON del backend. */
const CREDITS_REVALIDATE = 3600;

/**
 * Créditos de las fotos que piden atribución, para `/terminos-y-condiciones`.
 * Si la API falla devuelve `[]` y la página muestra que no hay créditos por mostrar.
 */
export async function getImageCredits(): Promise<IImageCredit[]> {
  try {
    const credits = await apiGet<IImageCredit[]>("/credits/images", CREDITS_REVALIDATE);
    return Array.isArray(credits) ? credits : [];
  } catch {
    return [];
  }
}
