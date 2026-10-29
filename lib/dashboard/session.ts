import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { IDashboardSession } from "@/interfaces/dashboard";
import { AUTH_COOKIE } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { toLDCRoles } from "@/lib/auth/backend-role";
import { hasAnyRole, type LDCRole } from "@/lib/auth/roles";

/**
 * Sesión del panel. Sin la cookie de sesión (`lgdc-auth`), `null`. Con ella, solo cuenta
 * `/auth/me`: los roles son los `roles` que devuelve, traducidos con `toLDCRoles`. Si falla (token
 * vencido o backend caído) o no trae ningún rol conocido, `null` (deniega).
 *
 * Memoizada por request: la piden el layout del panel, el layout de cada sección y las páginas de
 * acceso (para mandar al panel a quien ya entró).
 */
export const getDashboardSession = cache(async (): Promise<IDashboardSession | null> => {
  const jar = await cookies();
  if (!jar.has(AUTH_COOKIE)) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const roles = toLDCRoles(user.roles);
  if (roles.length === 0) return null;
  const firstName = user.name.split(" ")[0] || user.name;
  return { user: { name: user.name, email: user.email, greetingName: firstName }, roles };
});

/**
 * Exige sesión: sin ella, al login. Para las páginas de todas las cuentas (inicio, favoritos,
 * perfil).
 */
export async function requireDashboardSession(): Promise<IDashboardSession> {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  return session;
}

/**
 * Exige **alguno** de los roles: sin sesión, al login; sin ninguno de ellos, al inicio del panel
 * (`/dashboard`). Se llama desde el `layout.tsx` de cada sección y desde las server actions; las
 * secciones que comparten roles (p. ej. `/dashboard/comercio/*`, de comercio y servicio) pasan la
 * lista.
 */
export async function requireDashboardRole(
  role: LDCRole | readonly LDCRole[],
): Promise<IDashboardSession> {
  const session = await requireDashboardSession();
  const allowed: readonly LDCRole[] = typeof role === "string" ? [role] : role;
  if (!hasAnyRole(session.roles, allowed)) redirect("/dashboard");
  return session;
}
