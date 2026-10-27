"use client";

import { ExternalLink } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LDCThemeModeToggler } from "@/components/molecules/ldc-theme-mode-toggler";
import { dashboardNavigation } from "@/config/dashboard-navigation";
import type { LDCRole } from "@/lib/auth/roles";
import { getRoleHome } from "@/lib/dashboard/config";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";

/** Etiquetas de subrutas que no están en el menú. */
const SEGMENT_LABELS: Record<string, string> = { nueva: "Nueva", editar: "Editar" };

function buildCrumbs(pathname: string, role: LDCRole) {
  const home = getRoleHome(role);
  const crumbs: IBreadcrumbItem[] = [{ label: "Panel", href: home }];
  if (pathname === home || !pathname.startsWith(`${home}/`)) {
    crumbs.push({ label: "Inicio", href: home });
    return crumbs;
  }
  const items = dashboardNavigation[role].flatMap((g) => g.items);
  let acc = home;
  for (const seg of pathname.slice(home.length + 1).split("/").filter(Boolean)) {
    acc += `/${seg}`;
    const known = items.find((i) => i.href === acc);
    crumbs.push({
      label: known?.label ?? SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: acc,
    });
  }
  return crumbs;
}

export interface LDCDashboardHeaderProps {
  /** Rol del panel: base de las migas («Panel › …») */
  role: LDCRole;
  /** Controles extra a la derecha (p. ej. `LDCDevRoleSwitcher`) */
  actions?: ReactNode;
}

/**
 * LDCDashboardHeader - Barra superior del panel
 *
 * Botón del menú, isotipo (solo en móvil), migas por rol, «Ver el sitio» (desde md),
 * controles extra y el cambio de tema.
 */
export function LDCDashboardHeader({ role, actions }: LDCDashboardHeaderProps) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname, role);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <LDCLogo isotipoSize="xs" textClassName="hidden" className="md:hidden" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((c, i) => (
            <Fragment key={c.href + i}>
              <BreadcrumbItem className={i === 0 ? "hidden md:block" : "min-w-0"}>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage className="truncate">{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {i < crumbs.length - 1 && (
                <BreadcrumbSeparator className={i === 0 ? "hidden md:block" : undefined} />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        {actions}
        <LDCButton href="/" variant="ghost" size="sm" className="hidden md:inline-flex">
          <ExternalLink />
          Ver el sitio
        </LDCButton>
        <LDCThemeModeToggler />
      </div>
    </header>
  );
}
