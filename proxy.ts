import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLDCRole } from "@/lib/auth/roles";
import { isMockRolesEnabled, MOCK_ROLE_COOKIE } from "@/lib/dashboard/config";

const AUTH_COOKIE = "lgdc-auth";

/** Simulación de roles (solo dev, `NEXT_PUBLIC_MOCK_ROLES=true`): la cookie `ldc-mock-role` abre el panel. */
function hasMockRole(request: NextRequest): boolean {
  return isMockRolesEnabled() && isLDCRole(request.cookies.get(MOCK_ROLE_COOKIE)?.value ?? "");
}

/**
 * Next.js Proxy (formerly middleware.ts in Next 15-).
 * Responsibilities:
 *  1. Protect /dashboard/* by requiring the auth cookie (redirect to /dashboard/login if missing).
 *     With NEXT_PUBLIC_MOCK_ROLES=true, a valid `ldc-mock-role` cookie also passes (dev only).
 *  2. Honor UNDER_CONSTRUCTION for public routes, while keeping /dashboard always accessible.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Auth gate for /dashboard ---
  if (pathname.startsWith("/dashboard")) {
    const isLoginPage = pathname === "/dashboard/login";
    const hasAuth = request.cookies.has(AUTH_COOKIE) || hasMockRole(request);
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
  // Acceso por rol (/ingresar y /ingresar/[rol]): disponible como /dashboard/login.
  if (pathname === "/ingresar" || pathname.startsWith("/ingresar/")) {
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
