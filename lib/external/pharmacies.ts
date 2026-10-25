import "server-only";

import { execFile } from "child_process";
import { promisify } from "util";
import type { IPharmacy } from "@/interfaces/pharmacy";
import { stripAccents } from "@/lib/format/text";
import { ExternalServiceError } from "./errors";

const execFileAsync = promisify(execFile);

/**
 * Farmacias de turno desde la API de Boostr. https://api.boostr.cl/
 *
 * Se pide con `curl` porque Cloudflare bloquea el `fetch` de Node. Se invoca con `execFile`
 * (sin shell) y con argumentos fijos: nada de lo que manda el cliente llega a la línea de
 * comandos; el filtro por comuna se aplica después, en memoria.
 *
 * Solo servidor: lo usa el route handler `/api/pharmacies`.
 */

const BOOSTR_URL = "https://api.boostr.cl/pharmacies/24h.json";

interface BoostrPharmacy {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  latitude: string;
  longitude: string;
}

interface BoostrResponse {
  status: string;
  data: BoostrPharmacy[];
}

function transformPharmacy(pharmacy: BoostrPharmacy): IPharmacy {
  return {
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.street,
    phone: pharmacy.phone,
    city: pharmacy.city,
    lat: parseFloat(pharmacy.latitude),
    lng: parseFloat(pharmacy.longitude),
  };
}

/**
 * Farmacias de turno, filtradas por comuna si se indica (sin distinguir mayúsculas ni tildes,
 * y en ambos sentidos: «Viña» encuentra «Viña del Mar» y al revés).
 *
 * @throws {ExternalServiceError} 502 si Boostr responde algo inválido.
 */
export async function getOnDutyPharmacies(comuna?: string | null): Promise<IPharmacy[]> {
  const { stdout } = await execFileAsync("curl", ["-s", BOOSTR_URL], { timeout: 10000 });

  const data: BoostrResponse = JSON.parse(stdout);

  if (data.status !== "success" || !data.data) {
    console.error("[Pharmacies API] Invalid response structure");
    throw new ExternalServiceError(502, "Invalid response from pharmacy API");
  }

  let pharmacies = data.data.map(transformPharmacy);

  if (comuna) {
    const comunaNormalized = stripAccents(comuna.toLowerCase());
    pharmacies = pharmacies.filter((pharmacy) => {
      const pharmacyCityNormalized = stripAccents(pharmacy.city.toLowerCase());
      return (
        pharmacyCityNormalized.includes(comunaNormalized) ||
        comunaNormalized.includes(pharmacyCityNormalized)
      );
    });
  }

  return pharmacies;
}
