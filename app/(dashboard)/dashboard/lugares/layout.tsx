import { requireDashboardSession } from "@/lib/dashboard/session";

/**
 * `/dashboard/lugares/*` exige sesión (CLGDC-209). El rol colaborador lo exigen «Mis lugares» y la
 * edición (`[id]`); `nuevo` queda abierto a cualquier cuenta, porque publicar el primer lugar suma
 * el rol.
 */
export default async function DashboardLugaresLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardSession();
  return children;
}
