import { requireDashboardRole } from "@/lib/dashboard/session";

/**
 * `/dashboard/comercio/*` sirve a «Mis comercios» y a «Mis servicios»: entra quien tenga comercio
 * o servicio; si no, vuelve al inicio del panel.
 */
export default async function DashboardComercioLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole(["comercio", "servicio"]);
  return children;
}
