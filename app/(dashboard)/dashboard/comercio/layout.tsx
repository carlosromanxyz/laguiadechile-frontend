import { requireDashboardRole } from "@/lib/dashboard/session";

/** Solo el rol `comercio` entra en `/dashboard/comercio/*`; otro rol vuelve a su inicio. */
export default async function DashboardComercioLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole("comercio");
  return children;
}
