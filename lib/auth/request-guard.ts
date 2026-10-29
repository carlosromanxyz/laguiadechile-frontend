import "server-only";
import { NextResponse } from "next/server";

/**
 * Defensa contra login CSRF en los Route Handlers de auth.
 * - El cuerpo debe ser `application/json` (un formulario HTML entre sitios no puede mandarlo
 *   sin preflight de CORS): si no, 415.
 * - Si llega `Origin`, su host debe ser el `Host` del request: si no, 403.
 * Devuelve la respuesta de rechazo, o `null` si el request pasa.
 */
export function rejectCrossSiteAuth(request: Request): NextResponse | null {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ message: "Se espera application/json" }, { status: 415 });
  }

  const origin = request.headers.get("origin");
  if (origin !== null) {
    const host = request.headers.get("host");
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (!host || originHost !== host) {
      return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
    }
  }

  return null;
}
