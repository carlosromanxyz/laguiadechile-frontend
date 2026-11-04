import { requireDashboardSession } from "@/lib/dashboard/session";

/**
 * `/dashboard/eventos/*` exige sesión. El rol organizador lo exigen «Mis eventos» y la edición
 * (`[id]`); `nuevo` queda abierto a cualquier cuenta, porque publicar el primer evento suma el rol.
 */
export default async function DashboardEventosLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardSession();
  return children;
}
