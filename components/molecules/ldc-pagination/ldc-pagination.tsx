"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface LDCPaginationProps {
  /** Página actual (desde 1) */
  page: number;
  /** Elementos por página */
  pageSize: number;
  /** Total de elementos con los filtros actuales */
  total: number;
  /** Navega a la URL de una página (p. ej. dentro de una transición, para mostrar el esqueleto); por defecto `router.push` */
  onNavigate?: (href: string) => void;
  className?: string;
}

/** Números visibles: todos hasta 7 páginas; si no, la primera, la última y las vecinas de la actual. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const from = Math.max(2, Math.min(page - 1, pageCount - 3));
  const to = Math.min(pageCount - 1, Math.max(page + 1, 4));
  const middle = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return [1, ...(from > 2 ? ["gap" as const] : []), ...middle, ...(to < pageCount - 1 ? ["gap" as const] : []), pageCount];
}

/**
 * LDCPagination - Paginación de los listados del panel, sobre `ui/pagination`
 *
 * La página vive en la URL (`?page=`; la 1 se omite) y conserva el resto de los parámetros. Desde
 * `md`: «Mostrando 1–20 de 45», Anterior, números (el actual con `aria-current="page"` y el borde de
 * marca, rosado en claro y amarillo en oscuro, como `LDCStatusFilter`) y Siguiente. En móvil: «Página
 * 1 de 3» con Anterior y Siguiente de 44 px. Con una sola página, solo el texto «Mostrando N de N».
 *
 * @example
 * <LDCPagination page={2} pageSize={20} total={45} />
 */
export function LDCPagination({ page, pageSize, total, onNavigate, className }: LDCPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total <= 0) return null;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  if (pageCount === 1) {
    return (
      <p className={cn("font-open-sans text-sm text-muted-foreground", className)}>
        Mostrando {total} de {total}
      </p>
    );
  }

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function go(e: MouseEvent<HTMLAnchorElement>, target: number) {
    // Cmd/Ctrl/Shift + clic: que el navegador abra la otra pestaña como siempre.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const href = hrefFor(target);
    if (onNavigate) onNavigate(href);
    else router.push(href);
  }

  const edge = (target: number, disabled: boolean) =>
    disabled
      ? { "aria-disabled": true }
      : { href: hrefFor(target), onClick: (e: MouseEvent<HTMLAnchorElement>) => go(e, target) };

  const prevDisabled = current <= 1;
  const nextDisabled = current >= pageCount;
  const edgeClass = "size-11 px-0 md:h-8 md:w-auto md:px-2.5";

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <p className="font-open-sans text-sm text-muted-foreground" aria-live="polite">
        <span className="md:hidden">
          Página {current} de {pageCount}
        </span>
        <span className="hidden md:inline">
          Mostrando {from}–{to} de {total}
        </span>
      </p>
      <Pagination aria-label="Paginación" className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              size="sm"
              aria-label="Página anterior"
              {...edge(current - 1, prevDisabled)}
              className={cn(edgeClass, prevDisabled && "pointer-events-none opacity-50")}
            >
              <ChevronLeft aria-hidden />
              <span className="hidden md:inline">Anterior</span>
            </PaginationLink>
          </PaginationItem>
          {pageWindow(current, pageCount).map((n, i) =>
            n === "gap" ? (
              <PaginationItem key={`gap-${i}`} className="hidden md:block">
                <PaginationEllipsis className="size-8" />
              </PaginationItem>
            ) : (
              <PaginationItem key={n} className="hidden md:block">
                <PaginationLink
                  size="icon-sm"
                  isActive={n === current}
                  aria-label={`Página ${n}`}
                  href={hrefFor(n)}
                  onClick={(e) => go(e, n)}
                  className={cn(n === current && "border-pink dark:border-yellow")}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationLink
              size="sm"
              aria-label="Página siguiente"
              {...edge(current + 1, nextDisabled)}
              className={cn(edgeClass, nextDisabled && "pointer-events-none opacity-50")}
            >
              <span className="hidden md:inline">Siguiente</span>
              <ChevronRight aria-hidden />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
