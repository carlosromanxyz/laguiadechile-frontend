import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/api-client";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(`${INTERNAL_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  const jar = await cookies();
  jar.set(AUTH_COOKIE, payload.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  return NextResponse.json({ user: payload.user });
}
