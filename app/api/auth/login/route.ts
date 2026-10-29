import { NextResponse } from "next/server";
import { rejectCrossSiteAuth } from "@/lib/auth/request-guard";
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { forwardedForHeader } from "@/lib/auth/socket-ip";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";

export async function POST(request: Request) {
  const rejected = rejectCrossSiteAuth(request);
  if (rejected) return rejected;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(`${INTERNAL_BASE}/auth/login`, {
    method: "POST",
    // La IP del socket del cliente, nunca la cabecera que mande él: es la clave del throttle.
    headers: { "Content-Type": "application/json", ...forwardedForHeader(request) },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => ({}))) as {
    accessToken?: string;
    user?: unknown;
    message?: string | string[];
  };

  if (!res.ok || !payload.accessToken) {
    return NextResponse.json(
      { message: payload.message ?? "Credenciales inválidas" },
      { status: res.status || 401 },
    );
  }

  await setSessionCookie(payload.accessToken);

  return NextResponse.json({ user: payload.user });
}
