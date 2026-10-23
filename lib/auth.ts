import "server-only";
import { apiFetchServer, ApiError } from "./api-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetchServer<AuthUser>("/auth/me");
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
    return null;
  }
}
