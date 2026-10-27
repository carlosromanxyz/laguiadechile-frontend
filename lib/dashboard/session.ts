import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { IDashboardSession } from "@/interfaces/dashboard";
import { AUTH_COOKIE } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { MOCK_DASHBOARD_USERS } from "@/lib/mock/dashboard/users";
import { isLDCRole, type LDCRole } from "@/lib/auth/roles";
import { getRoleHome, isMockRolesEnabled, MOCK_ROLE_COOKIE } from "./config";

/**
 * Sesión del panel.
 * 1. Con la cookie de sesión real (`lgdc-auth`), solo cuenta `/auth/me`: si responde, es el
 *    administrador real; si falla (token vencido o backend caído), `null`. Así una caída del
 *    backend no se disfraza de sesión simulada.
 * 2. Sin esa cookie, y con la simulación activa, el usuario simulado de la cookie `ldc-mock-role`.
 * 3. Si no, `null`.
 *
 * Memoizada por request: la piden el layout del panel y el layout de cada rol.
 */
export const getDashboardSession = cache(async (): Promise<IDashboardSession | null> => {
  const jar = await cookies();
  if (jar.has(AUTH_COOKIE)) {
    const user = await getCurrentUser();
    if (!user) return null;
    const firstName = user.name.split(" ")[0] || user.name;
    return {
      user: { name: user.name, email: user.email, greetingName: firstName },
      role: "admin",
      simulated: false,
    };
  }

  if (!isMockRolesEnabled()) return null;
  const role = jar.get(MOCK_ROLE_COOKIE)?.value ?? "";
  if (!isLDCRole(role)) return null;
  return { user: MOCK_DASHBOARD_USERS[role], role, simulated: true };
});

/**
 * Exige el rol del prefijo (`/dashboard/{rol}`): sin sesión, al login; con otro rol, a su inicio.
 * Se llama desde el `layout.tsx` de cada rol.
 */
export async function requireDashboardRole(role: LDCRole): Promise<IDashboardSession> {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  if (session.role !== role) redirect(getRoleHome(session.role));
  return session;
}
