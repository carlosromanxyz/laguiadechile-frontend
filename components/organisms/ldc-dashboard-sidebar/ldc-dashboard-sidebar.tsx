"use client";

import Link from "next/link";
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
  DASHBOARD_PUBLISH_ROLES,
  dashboardProfileHref,
  dashboardPublishCta,
  getDashboardNavigation,
} from "@/config/dashboard-navigation";
import { hasAnyRole, LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";

export interface LDCDashboardSidebarProps {
  /** Roles de la cuenta: definen los grupos del menú, el CTA y la línea de roles del menú de usuario */
  roles: readonly LDCRole[];
  user: { name: string; email: string };
  /**
   * Contadores por `href` del ítem (`{ "/dashboard/admin/moderacion": 3 }`) o, si el ítem se repite
   * en dos grupos, por `rol:href` (`{ "servicio:/dashboard/comercio/publicaciones": 1 }`)
   */
  badges?: Record<string, number>;
}

/**
 * LDCDashboardSidebar - Menú lateral del panel
 *
 * Sidebar de shadcn con identidad LDC: logo, el CTA naranjo «Publicar», los grupos del menú que
 * tocan a los roles de la cuenta (General siempre; Mis avisos, Mis comercios, Mis servicios y
 * Admin según el rol) y el menú de usuario con sus roles. En móvil, el propio Sidebar lo abre en
 * un Sheet.
 */
export function LDCDashboardSidebar({ roles, user, badges }: LDCDashboardSidebarProps) {
  const canPublish = hasAnyRole(roles, DASHBOARD_PUBLISH_ROLES);
  // El rol usuario lo tiene toda cuenta: la línea muestra los demás (sin ellos, el email).
  const roleLine = roles
    .filter((r) => r !== "usuario")
    .map((r) => LDC_ROLE_META[r].label)
    .join(" · ");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pt-3">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label="La Guía de Chile, inicio del panel"
          >
            <LDCLogo
              isotipoSize="xs"
              className="group-data-[collapsible=icon]:-ml-1.5 group-data-[collapsible=icon]:scale-90"
              textClassName="group-data-[collapsible=icon]:hidden"
            />
          </Link>
        </div>
        {canPublish && (
          <LDCCTAButton
            href={dashboardPublishCta.href}
            text={dashboardPublishCta.label}
            className="w-full justify-center group-data-[collapsible=icon]:hidden"
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        {getDashboardNavigation(roles).map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <LDCSidebarItem
                    key={item.href}
                    {...item}
                    badge={
                      badges?.[group.requires ? `${group.requires}:${item.href}` : item.href] ??
                      badges?.[item.href]
                    }
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <LDCUserMenu
          name={user.name}
          email={user.email}
          roleLine={roleLine || undefined}
          profileHref={dashboardProfileHref}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
