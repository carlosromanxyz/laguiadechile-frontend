import { redirect } from "next/navigation";
import { LDCDashboardHeader } from "@/components/organisms/ldc-dashboard-header";
import { LDCDashboardSidebar } from "@/components/organisms/ldc-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");

  return (
    <SidebarProvider>
      <LDCDashboardSidebar user={user} />
      <SidebarInset>
        <LDCDashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
