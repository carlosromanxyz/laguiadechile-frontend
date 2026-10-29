import { requireDashboardRole } from "@/lib/dashboard/session";

/** `/dashboard/avisos/*` es de quien tiene el rol avisador; si no, vuelve al inicio del panel. */
export default async function DashboardAvisosLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole("avisador");
  return children;
}
