"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
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

function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: IBreadcrumbItem[] = [{ label: "Dashboard", href: "/dashboard" }];
  let acc = "";
  for (const seg of segments.slice(1)) {
    acc += `/${seg}`;
    const known = dashboardNavigation
      .flatMap((g) => g.items)
      .find((i) => i.href === `/dashboard${acc}`);
    crumbs.push({
      label: known?.label ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: `/dashboard${acc}`,
    });
  }
  return crumbs;
}

export function LDCDashboardHeader() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((c, i) => (
            <Fragment key={c.href}>
              <BreadcrumbItem className={i === 0 ? "hidden md:block" : undefined}>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
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
      <div className="ml-auto">
        <LDCThemeModeToggler />
      </div>
    </header>
  );
}
