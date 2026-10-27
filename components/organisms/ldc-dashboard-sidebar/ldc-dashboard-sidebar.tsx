"use client";

import Link from "next/link";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCLogo } from "@/components/atoms/ldc-logo";
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
import {
  dashboardNavigation,
  dashboardProfileHref,
  dashboardRoleCta,
} from "@/config/dashboard-navigation";
import { getRoleConfig, type LDCRole } from "@/lib/auth/roles";
import { getRoleHome } from "@/lib/dashboard/config";

export interface LDCDashboardSidebarProps {
  /** Rol del panel: define el menú (`dashboardNavigation[role]`), el badge y el CTA */
  role: LDCRole;
  user: { name: string; email: string };
  /** Contadores por `href` del ítem (p. ej. `{ "/dashboard/admin/moderacion": 3 }`) */
  badges?: Record<string, number>;
}

/**
 * LDCDashboardSidebar - Menú lateral del panel por rol
 *
 * Sidebar de shadcn con identidad LDC: logo, badge del rol, CTA naranjo opcional, grupos del
 * menú del rol y el menú de usuario. En móvil, el propio Sidebar lo abre en un Sheet.
 */
export function LDCDashboardSidebar({ role, user, badges }: LDCDashboardSidebarProps) {
  const cta = dashboardRoleCta[role];
  const roleBadgeVariant = `role-${role}` as const;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pt-3">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Link
            href={getRoleHome(role)}
            className="rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label="La Guía de Chile, inicio del panel"
          >
            <LDCLogo
              isotipoSize="xs"
              className="group-data-[collapsible=icon]:-ml-1.5 group-data-[collapsible=icon]:scale-90"
              textClassName="group-data-[collapsible=icon]:hidden"
            />
          </Link>
          <LDCBadge variant={roleBadgeVariant} className="group-data-[collapsible=icon]:hidden">
            {getRoleConfig(role).label}
          </LDCBadge>
        </div>
        {cta && (
          <LDCCTAButton
            href={cta.href}
            text={cta.label}
            className="w-full justify-center group-data-[collapsible=icon]:hidden"
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        {dashboardNavigation[role].map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <LDCSidebarItem key={item.href} {...item} badge={badges?.[item.href]} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <LDCUserMenu name={user.name} email={user.email} profileHref={dashboardProfileHref[role]} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
