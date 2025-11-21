import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Proxy - Construction Mode Handler
 *
 * This proxy runs on the Node.js runtime and handles construction/maintenance mode.
 * When UNDER_CONSTRUCTION is true, all routes are redirected to /en-construccion
 * except for the construction page itself and Next.js internal routes.
 *
 * Note: In Next.js 16, the middleware.ts convention has been renamed to proxy.ts
 * to better clarify the network boundary and routing focus. The proxy runs on
 * Node.js runtime (not Edge runtime).
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if site is under construction
  const isUnderConstruction = process.env.UNDER_CONSTRUCTION === "true";

  // Skip proxy logic if not under construction
  if (!isUnderConstruction) {
    return NextResponse.next();
  }

  // Allow access to the construction page itself to prevent redirect loops
  if (pathname === "/en-construccion") {
    return NextResponse.next();
  }

  // Allow Next.js internal routes (static files, API routes, etc.)
  // These paths are necessary for Next.js to function properly
  if (
    pathname.startsWith("/_next") || // Next.js internal routes
    pathname.startsWith("/api") || // API routes (if you have any)
    pathname.includes(".") // Static files (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Redirect all other routes to the construction page
  const url = request.nextUrl.clone();
  url.pathname = "/en-construccion";

  return NextResponse.redirect(url);
}

/**
 * Matcher configuration - defines which routes this proxy runs on
 *
 * This matcher ensures the proxy runs on all routes except:
 * - Static files in the public folder
 * - Next.js internal files (_next/static, _next/image)
 * - Favicon and other root-level assets
 *
 * The matcher uses a negative lookahead pattern for better performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
