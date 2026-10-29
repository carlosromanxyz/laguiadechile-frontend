import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/api-client";

/**
 * Next.js Proxy (formerly middleware.ts in Next 15-).
 * Responsibilities:
 *  1. Protect /dashboard/* by requiring the auth cookie (redirect to /dashboard/login if missing).
 *     The role itself is checked by the dashboard layouts (`/auth/me`), not here.
 *  2. Honor UNDER_CONSTRUCTION for public routes, while keeping /dashboard always accessible.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Auth gate for /dashboard ---
  if (pathname.startsWith("/dashboard")) {
    const isLoginPage = pathname === "/dashboard/login";
    const hasAuth = request.cookies.has(AUTH_COOKIE);
    if (!hasAuth && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- Construction mode for public routes ---
  const isUnderConstruction = process.env.UNDER_CONSTRUCTION === "true";
  if (!isUnderConstruction) {
    return NextResponse.next();
  }
  if (pathname === "/en-construccion") {
    return NextResponse.next();
  }
  // Acceso por rol (/ingresar y /ingresar/[rol]) y registro: disponibles como /dashboard/login.
  if (pathname === "/ingresar" || pathname.startsWith("/ingresar/") || pathname === "/registro") {
    return NextResponse.next();
  }
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = "/en-construccion";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
