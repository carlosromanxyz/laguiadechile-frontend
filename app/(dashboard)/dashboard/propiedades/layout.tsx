import { requireDashboardSession } from "@/lib/dashboard/session";

/**
 * `/dashboard/propiedades/*` exige sesión (CLGDC-164). El rol propietario lo exigen «Mis
 * propiedades» y la edición (`[id]`); `nueva` queda abierta a cualquier cuenta, porque publicar la
 * primera propiedad suma el rol.
 */
export default async function DashboardPropiedadesLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardSession();
  return children;
}
