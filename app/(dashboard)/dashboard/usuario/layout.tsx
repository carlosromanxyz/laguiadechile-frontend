import { requireDashboardRole } from "@/lib/dashboard/session";

/** Solo el rol `usuario` entra en `/dashboard/usuario/*`; otro rol vuelve a su inicio. */
export default async function DashboardUsuarioLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole("usuario");
  return children;
}
