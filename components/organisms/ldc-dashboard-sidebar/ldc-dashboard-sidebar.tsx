"use client";

import Link from "next/link";
import { dashboardNavigation } from "@/config/dashboard-navigation";
import { LDCSidebarItem } from "@/components/molecules/ldc-sidebar-item";
import { LDCUserMenu } from "@/components/molecules/ldc-user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";

export interface LDCDashboardSidebarProps {
  user: { name: string; email: string };
}

export function LDCDashboardSidebar({ user }: LDCDashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2 px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              LG
            </span>
            <span className="group-data-[collapsible=icon]:hidden">La Guía de Chile</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {dashboardNavigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <LDCSidebarItem key={item.href} {...item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <LDCUserMenu name={user.name} email={user.email} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
