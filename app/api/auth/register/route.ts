import { NextResponse } from "next/server";
import { rejectCrossSiteAuth } from "@/lib/auth/request-guard";
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { forwardedForHeader } from "@/lib/auth/socket-ip";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";

interface BackendPayload {
  accessToken?: string;
  user?: unknown;
  message?: string | string[];
}

/**
 * Registro público. Solo reenvía `name`, `email` y `password` (un `role` del cliente se
 * descarta): el backend crea siempre un USUARIO y rechaza `role` con 400. Con 201 deja la
 * cookie de sesión, igual que el login.
 */
export async function POST(request: Request) {
  const rejected = rejectCrossSiteAuth(request);
  if (rejected) return rejected;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const input = (raw ?? {}) as Record<string, unknown>;
  const body = { name: input.name, email: input.email, password: input.password };

  const res = await fetch(`${INTERNAL_BASE}/auth/register`, {
    method: "POST",
    // La IP del socket del cliente, nunca la cabecera que mande él: es la clave del throttle.
    headers: { "Content-Type": "application/json", ...forwardedForHeader(request) },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = (await res.json().catch(() => ({}))) as BackendPayload;

  if (!res.ok || !payload.accessToken) {
    return NextResponse.json(
      { message: payload.message ?? "No pudimos crear tu cuenta" },
      { status: res.ok ? 502 : res.status || 500 },
    );
  }

  await setSessionCookie(payload.accessToken);

  return NextResponse.json({ user: payload.user }, { status: 201 });
}
