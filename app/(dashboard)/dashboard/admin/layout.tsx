import { requireDashboardRole } from "@/lib/dashboard/session";

/** Solo el rol `admin` entra en `/dashboard/admin/*`; otro rol vuelve a su inicio. */
export default async function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole("admin");
  return children;
}
