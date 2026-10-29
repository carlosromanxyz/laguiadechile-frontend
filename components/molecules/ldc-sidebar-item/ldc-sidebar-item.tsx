"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  /** Activo solo con la ruta exacta (el inicio del panel) */
  exact?: boolean;
  /**
   * Si el `href` lleva query (p. ej. `?tipo=servicio`), el ítem solo se marca cuando la URL trae
   * esos mismos valores. Con `queryDefault`, también se marca si la URL no trae la clave (el
   * primer grupo que comparte la ruta).
   */
  queryDefault?: boolean;
  /** Contador a la derecha (p. ej. pendientes de moderación); 0 o vacío no se muestra */
  badge?: number;
}

/**
 * LDCSidebarItem - Ítem del menú del panel
 *
 * Ítem activo en negrita con el ícono en el color de acento (`text-pink dark:text-yellow`),
 * contador opcional y, en el Sheet móvil, 40 px de alto y cierre del menú al navegar. El tooltip
 * (para el menú plegado) no se monta en móvil: se comería el primer Escape del Sheet.
 */
export function LDCSidebarItem({
  href,
  label,
  icon: Icon,
  exact,
  badge,
  queryDefault,
}: LDCSidebarItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile, setOpenMobile } = useSidebar();
  const [path, query] = href.split("?");
  let isActive = pathname === path || (!exact && pathname.startsWith(`${path}/`));
  for (const [key, value] of new URLSearchParams(query)) {
    const current = searchParams.get(key);
    if (current === null ? !queryDefault : current !== value) isActive = false;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={isMobile ? undefined : label}
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
          className="top-2.5 rounded-full bg-pink font-bold text-black md:top-1.5 dark:bg-yellow dark:text-black"
        >
          {badge}
          <span className="sr-only"> pendientes</span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}
