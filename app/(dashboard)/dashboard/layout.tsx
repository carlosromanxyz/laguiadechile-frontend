import { redirect } from "next/navigation";
import { LDCDashboardHeader } from "@/components/organisms/ldc-dashboard-header";
import { LDCDashboardSidebar } from "@/components/organisms/ldc-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardSession } from "@/lib/dashboard/session";
import { hasAnyRole, type LDCRole } from "@/lib/auth/roles";
import { getModerationQueue } from "@/services/dashboard/admin";
import { getMyInReviewCountByType } from "@/services/dashboard/comercio";
import { getMyClassifiedsPendingCount } from "@/services/dashboard/usuario";

/**
 * Contadores del menú, por `href` del ítem (o `rol:href` si el ítem se repite en dos grupos, como
 * «Mis fichas» en «Mis comercios» y «Mis servicios»): solo los de los grupos que ve la cuenta.
 */
async function getNavBadges(roles: readonly LDCRole[]): Promise<Record<string, number>> {
  const [moderation, inReview, classifieds] = await Promise.all([
    roles.includes("admin") ? getModerationQueue().then((q) => q.length) : 0,
    hasAnyRole(roles, ["comercio", "servicio"])
      ? getMyInReviewCountByType()
      : { comercio: 0, servicio: 0 },
    roles.includes("avisador") ? getMyClassifiedsPendingCount() : 0,
  ]);
  return {
    "/dashboard/admin/moderacion": moderation,
    "comercio:/dashboard/comercio/publicaciones": inReview.comercio,
    "servicio:/dashboard/comercio/publicaciones": inReview.servicio,
    "/dashboard/avisos": classifieds,
  };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  const badges = await getNavBadges(session.roles);

  return (
    <SidebarProvider>
      <LDCDashboardSidebar roles={session.roles} user={session.user} badges={badges} />
      <SidebarInset>
        <LDCDashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
