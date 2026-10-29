import { requireDashboardSession } from "@/lib/dashboard/session";

/**
 * `/dashboard/usuario/*` (favoritos y perfil) es de toda cuenta, tenga los roles que tenga: solo
 * pide sesión.
 */
export default async function DashboardUsuarioLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardSession();
  return children;
}
