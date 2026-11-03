import { requireDashboardSession } from "@/lib/dashboard/session";

/**
 * `/dashboard/avisos/*` exige sesión. El rol avisador lo exigen «Mis avisos» y la edición
 * (`[id]`); `nuevo` queda abierto a cualquier cuenta, porque publicar el primer aviso suma el rol.
 */
export default async function DashboardAvisosLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardSession();
  return children;
}
