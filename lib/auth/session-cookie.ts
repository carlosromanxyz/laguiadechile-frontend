import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/api-client";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/** Guarda el JWT del backend en la cookie de sesión (httpOnly). La usan login y registro. */
export async function setSessionCookie(accessToken: string): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}
