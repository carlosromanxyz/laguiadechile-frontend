import { redirect } from "next/navigation";
import { LDCDevRoleSwitcher } from "@/components/molecules/ldc-dev-role-switcher";
import { LDCDashboardHeader } from "@/components/organisms/ldc-dashboard-header";
import { LDCDashboardSidebar } from "@/components/organisms/ldc-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardSession } from "@/lib/dashboard/session";
import type { LDCRole } from "@/lib/auth/roles";
import { getModerationQueue } from "@/services/dashboard/admin";
import { getMyInReviewCount } from "@/services/dashboard/comercio";
import { getMyExpiredCount } from "@/services/dashboard/usuario";

/** Contadores del menú de cada rol, por `href` del ítem. */
async function getNavBadges(role: LDCRole): Promise<Record<string, number>> {
  if (role === "admin") {
    return { "/dashboard/admin/moderacion": (await getModerationQueue()).length };
  }
  if (role === "comercio") {
    return { "/dashboard/comercio/publicaciones": await getMyInReviewCount() };
  }
  return { "/dashboard/usuario/avisos": await getMyExpiredCount() };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  const badges = await getNavBadges(session.role);

  return (
    <SidebarProvider>
      <LDCDashboardSidebar role={session.role} user={session.user} badges={badges} />
      <SidebarInset>
        <LDCDashboardHeader
          role={session.role}
          actions={session.simulated ? <LDCDevRoleSwitcher role={session.role} /> : undefined}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
