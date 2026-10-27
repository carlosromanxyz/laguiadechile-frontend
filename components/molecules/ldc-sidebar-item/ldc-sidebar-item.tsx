"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export interface LDCSidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Activo solo con la ruta exacta (el inicio de cada rol) */
  exact?: boolean;
  /** Contador a la derecha (p. ej. pendientes de moderación); 0 o vacío no se muestra */
  badge?: number;
}

/**
 * LDCSidebarItem - Ítem del menú del panel
 *
 * Ítem activo en negrita con el ícono en el color de acento (`text-pink dark:text-yellow`),
 * contador opcional y, en el Sheet móvil, 40 px de alto y cierre del menú al navegar.
 */
export function LDCSidebarItem({ href, label, icon: Icon, exact, badge }: LDCSidebarItemProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = pathname === href || (!exact && pathname.startsWith(`${href}/`));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        className="h-10 md:h-8 data-[active=true]:font-bold data-[active=true]:[&>svg]:text-pink dark:data-[active=true]:[&>svg]:text-yellow"
      >
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
      {badge ? (
        <SidebarMenuBadge
          className="top-2.5 rounded-full bg-pink font-bold text-white md:top-1.5 dark:bg-yellow dark:text-black"
        >
          {badge}
          <span className="sr-only"> pendientes</span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}
