import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { IDashboardSession } from "@/interfaces/dashboard";
import { AUTH_COOKIE } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { toLDCRole } from "@/lib/auth/backend-role";
import type { LDCRole } from "@/lib/auth/roles";
import { getRoleHome } from "./config";

/**
 * Sesión del panel. Sin la cookie de sesión (`lgdc-auth`), `null`. Con ella, solo cuenta
 * `/auth/me`: el rol es el `role` que devuelve, traducido con `toLDCRole`. Si falla (token
 * vencido o backend caído) o el rol es desconocido o no viene, `null` (deniega).
 *
 * Memoizada por request: la piden el layout del panel, el layout de cada rol y las páginas de
 * acceso (para mandar al panel a quien ya entró).
 */
export const getDashboardSession = cache(async (): Promise<IDashboardSession | null> => {
  const jar = await cookies();
  if (!jar.has(AUTH_COOKIE)) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const role = toLDCRole(user.role);
  if (!role) return null;
  const firstName = user.name.split(" ")[0] || user.name;
  return { user: { name: user.name, email: user.email, greetingName: firstName }, role };
});

/**
 * Exige el rol del prefijo (`/dashboard/{rol}`): sin sesión, al login; con otro rol, a su inicio.
 * Se llama desde el `layout.tsx` de cada rol. Las páginas que comparten dos roles (p. ej.
 * `/dashboard/publicar`) pasan la lista de roles que aceptan.
 */
export async function requireDashboardRole(
  role: LDCRole | readonly LDCRole[],
): Promise<IDashboardSession> {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  const allowed: readonly LDCRole[] = typeof role === "string" ? [role] : role;
  if (!allowed.includes(session.role)) redirect(getRoleHome(session.role));
  return session;
}
