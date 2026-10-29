import { NextResponse } from "next/server";
import { isMetricEvent } from "@/lib/metrics/track-metric";
import { getSocketIp } from "@/lib/auth/socket-ip";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";

// TODO(CLGDC-93): cookie de visitante anónimo `ldc-vid` (uuid, 1 año, httpOnly,
// lax, `secure` en prod), reenviada en `X-Visitor-Id` para deduplicar. No se
// crea hasta que el backend la consuma.

/** Tope del cuerpo en bytes; se exige `Content-Length` para aplicarlo antes de leer. */
const MAX_BODY = 1024;
const BACKEND_TIMEOUT_MS = 3000;

/** `sendBeacon` con un Blob JSON manda `application/json`; se acepta también `text/plain`. */
const ACCEPTED_TYPES = ["application/json", "text/plain"];

/**
 * Rechaza lo que no venga de la propia página: 415 si el tipo no es JSON ni
 * texto, y 403 si llega un `Origin` cuyo host no es el `Host` del request
 * (mismo criterio que `rejectCrossSiteAuth` de `lib/auth/request-guard.ts`,
 * que exige solo `application/json`).
 */
function rejectCrossSite(request: Request): NextResponse | null {
  const type = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ACCEPTED_TYPES.includes(type)) {
    return NextResponse.json({ message: "Tipo de contenido no admitido" }, { status: 415 });
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

/**
 * POST /api/metrics - Registra un evento de una ficha (`view`, `whatsapp`,
 * `call`, `web`) y lo reenvía a `POST /metrics/events` del backend.
 *
 * Responde 415/403 si no viene de la propia página (`rejectCrossSite`),
 * 204 sin reenviar nada si llega `Sec-GPC: 1` o `DNT: 1`, 411/413 si falta
 * `Content-Length` o pasa de 1 KB (antes de leer el cuerpo), 400 si el
 * cuerpo no es válido y 204 en cualquier otro caso: los errores del
 * backend (incluido el 429) no llegan al navegador. `X-Forwarded-For` lleva
 * solo la IP del socket marcada por el gancho de `instrumentation.ts`
 * (`getSocketIp`); si no se conoce, no se reenvía.
 */
export async function POST(request: Request) {
  const rejected = rejectCrossSite(request);
  if (rejected) return rejected;

  if (
    request.headers.get("sec-gpc") === "1" ||
    request.headers.get("dnt") === "1"
  ) {
    return new NextResponse(null, { status: 204 });
  }

  const declared = request.headers.get("content-length");
  if (declared === null) {
    return NextResponse.json({ message: "Falta Content-Length" }, { status: 411 });
  }
  const length = Number(declared);
  if (!Number.isInteger(length) || length < 0 || length > MAX_BODY) {
    return NextResponse.json({ message: "Evento demasiado grande" }, { status: 413 });
  }

  const raw = await request.text().catch(() => "");
  if (!raw || Buffer.byteLength(raw) > MAX_BODY) {
    return NextResponse.json({ message: "Evento inválido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: "Evento inválido" }, { status: 400 });
  }
  if (!isMetricEvent(body)) {
    return NextResponse.json({ message: "Evento inválido" }, { status: 400 });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const ip = getSocketIp(request.headers);
  if (ip) headers["X-Forwarded-For"] = ip;

  try {
    await fetch(`${INTERNAL_BASE}/metrics/events`, {
      method: "POST",
      headers,
      body: JSON.stringify({ listingId: body.listingId, kind: body.kind }),
      cache: "no-store",
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch {
    // El tracking no debe fallar hacia el navegador.
  }

  return new NextResponse(null, { status: 204 });
}
