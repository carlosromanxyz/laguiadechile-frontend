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
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";

const HOME = "/dashboard";

/** Etiquetas de subrutas que no están en el menú. */
const SEGMENT_LABELS: Record<string, string> = { nueva: "Nueva", nuevo: "Nuevo", editar: "Editar" };

/**
 * Páginas fuera del menú: los resúmenes de cada sección y las páginas que comparten varios roles.
 * Los prefijos de sección (`/dashboard/usuario`, `/dashboard/comercio`, `/dashboard/admin`) solo
 * salen en las migas si son la página actual: más adentro manda el ítem del menú.
 */
const PAGE_LABELS: Record<string, string> = {
  "/dashboard/publicar": "Publicar",
  "/dashboard/usuario": "Mi cuenta",
  "/dashboard/comercio": "Resumen de fichas",
  "/dashboard/admin": "Admin",
};

/** Etiqueta de cada ruta del menú, sin la query (`?tipo=` no cambia la etiqueta). */
const NAV_LABELS: Record<string, string> = Object.fromEntries(
  dashboardNavigation.flatMap((g) => g.items).map((i) => [i.href.split("?")[0], i.label]),
);

function capitalize(seg: string) {
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

/** Migas desde `/dashboard`: «Panel › Mis avisos › Editar». */
function buildCrumbs(pathname: string) {
  const crumbs: IBreadcrumbItem[] = [{ label: "Panel", href: HOME }];
  if (pathname === HOME || !pathname.startsWith(`${HOME}/`)) {
    crumbs.push({ label: "Inicio", href: HOME });
    return crumbs;
  }
  const segments = pathname.slice(HOME.length + 1).split("/").filter(Boolean);
  let acc = HOME;
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const navLabel = NAV_LABELS[acc];
    if (navLabel) {
      crumbs.push({ label: navLabel, href: acc });
    } else if (i > 0) {
      crumbs.push({ label: SEGMENT_LABELS[seg] ?? capitalize(seg), href: acc });
    } else if (i === segments.length - 1) {
      // Prefijo de sección: solo si es la página actual.
      crumbs.push({ label: PAGE_LABELS[acc] ?? capitalize(seg), href: acc });
    }
  });
  return crumbs;
}

export interface LDCDashboardHeaderProps {
  /** Controles extra a la derecha, antes del cambio de tema */
  actions?: ReactNode;
}

/**
 * LDCDashboardHeader - Barra superior del panel
 *
 * Botón del menú, isotipo (solo en móvil), migas desde `/dashboard`, «Ver el sitio» (desde md),
 * controles extra y el cambio de tema.
 */
export function LDCDashboardHeader({ actions }: LDCDashboardHeaderProps) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

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
