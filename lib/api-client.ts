import { cookies } from "next/headers";

export const AUTH_COOKIE = "lgdc-auth";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3014/api";

export class ApiError extends Error {
  constructor(public status: number, message: string, public payload?: unknown) {
    super(message);
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let payload: unknown = undefined;
  let message = `${res.status} ${res.statusText}`;
  try {
    payload = await res.json();
    const m = (payload as { message?: string | string[] }).message;
    if (Array.isArray(m)) message = m.join("; ");
    else if (typeof m === "string") message = m;
  } catch {
    // ignore
  }
  return new ApiError(res.status, message, payload);
}

/**
 * Server-side fetch to the backend. Uses internal Docker URL and the auth cookie
 * from the current request automatically. Use from Server Components / Server Actions.
 */
export async function apiFetchServer<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${INTERNAL_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Client-side fetch. Uses the public URL. The auth cookie is httpOnly so the
 * browser sends it automatically via `credentials: "include"` only for same-origin;
 * for cross-origin to the backend we rely on the proxy routes under `/api/auth/*`.
 */
export async function apiFetchClient<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`${PUBLIC_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiBase = { internal: INTERNAL_BASE, public: PUBLIC_BASE };
