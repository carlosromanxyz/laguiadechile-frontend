"use client";

import Link from "next/link";
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
import { dashboardProfileHref, getDashboardNavigation } from "@/config/dashboard-navigation";
import { LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";
import type { PersonName } from "@/lib/people";

export interface LDCDashboardSidebarProps {
  /** Roles de la cuenta: definen los grupos del menú y la línea de roles del menú de usuario */
  roles: readonly LDCRole[];
  /** La cuenta (nombre, apellido y correo) para el menú de usuario */
  user: PersonName & { email: string };
  /** Contadores por `href` del ítem (p. ej. `{ "/dashboard/admin/moderacion": 3 }`) */
  badges?: Record<string, number>;
}

/**
 * LDCDashboardSidebar - Menú lateral del panel
 *
 * Sidebar de shadcn con identidad LDC: logo, los grupos del menú que
 * tocan a los roles de la cuenta (General siempre; Mis avisos, Mis comercios, Mis servicios y
 * Admin según el rol) y el menú de usuario con sus roles. En móvil, el propio Sidebar lo abre en
 * un Sheet.
 */
export function LDCDashboardSidebar({ roles, user, badges }: LDCDashboardSidebarProps) {
  const groups = getDashboardNavigation(roles);
  // Ítems con la misma ruta en dos grupos (las fichas): sin `?tipo=` en la URL se marca el del
  // primer grupo visible.
  const seenPaths = new Set<string>();
  const defaultHrefs = new Set<string>();
  for (const item of groups.flatMap((g) => g.items)) {
    const [path, query] = item.href.split("?");
    if (query && !seenPaths.has(path)) defaultHrefs.add(item.href);
    seenPaths.add(path);
  }
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
      </SidebarHeader>

      <nav aria-label="Menú del panel" className="flex min-h-0 flex-1 flex-col">
        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <LDCSidebarItem
                      key={item.href}
                      {...item}
                      queryDefault={defaultHrefs.has(item.href)}
                      badge={badges?.[item.href]}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </nav>

      <SidebarFooter className="border-t border-sidebar-border">
        <LDCUserMenu
          user={user}
          roleLine={roleLine || undefined}
          profileHref={dashboardProfileHref}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
