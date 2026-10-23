import "server-only";

/**
 * Server-side fetch to the NestJS backend for PUBLIC reads.
 *
 * Uses the internal Docker URL (`INTERNAL_API_URL`) and does NOT touch cookies,
 * so it can be used inside `generateStaticParams`/static rendering without
 * opting pages into dynamic. Data is revalidated periodically (ISR).
 *
 * Per Next.js guidance, Server Components fetch the backend through this layer
 * directly; Route Handlers (for Client Components) reuse the same DAL.
 */
const BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";
const DEFAULT_REVALIDATE = 60;

export async function apiGet<T>(
  path: string,
  revalidate: number = DEFAULT_REVALIDATE,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Backend ${res.status} on ${path}`);
  }
  return (await res.json()) as T;
}

/** Returns null on 404 instead of throwing (for getBySlug). */
export async function apiGetOrNull<T>(
  path: string,
  revalidate: number = DEFAULT_REVALIDATE,
): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Backend ${res.status} on ${path}`);
  return (await res.json()) as T;
}

/** Build a query string from a params object, skipping undefined/null/empty. */
export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
