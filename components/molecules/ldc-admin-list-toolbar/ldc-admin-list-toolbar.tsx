"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Espera tras la última tecla antes de escribir `?q=` en la URL. */
const SEARCH_DEBOUNCE_MS = 300;

export interface LDCAdminListToolbarStatusItem {
  /** Valor de `?estado=` (el de «Todos» no se escribe en la URL) */
  key: string;
  label: string;
  count: number;
}

export interface LDCAdminListToolbarProps {
  /** Búsqueda actual (`?q=`) */
  q: string;
  /** Slug de la ciudad elegida (`?ciudad=`); vacío, todas */
  city?: string;
  /** Ciudades del filtro; sin ellas, no hay filtro de ciudad (p. ej. Usuarios, Regiones o «Mensajes») */
  cities?: readonly { id: string; name: string; slug: string }[];
  /** Pills de estado en orden («Todos» primero), con los `counts` del listado; sin ellas, no hay pills */
  statusItems?: readonly LDCAdminListToolbarStatusItem[];
  /** Clave del estado activo */
  status?: string;
  /** Clave de «Todos» (se omite en la URL) */
  allKey?: string;
  /** Navega a la URL con el filtro nuevo (p. ej. dentro de una transición); por defecto `router.replace` */
  onNavigate?: (href: string) => void;
  /** Etiqueta y placeholder de la búsqueda */
  searchLabel?: string;
}

/**
 * LDCAdminListToolbar - Búsqueda, ciudad y estado de un listado del panel admin
 *
 * La ciudad y las pills son opcionales: sin `cities` o sin `statusItems` no se muestran (Usuarios
 * solo lleva la búsqueda, CLGDC-127).
 *
 * Todo vive en la URL y cada cambio vuelve a la página 1: la búsqueda escribe `?q=` 300 ms después
 * de la última tecla, el `LDCCombobox` de ciudad escribe `?ciudad=` y las pills de `LDCStatusFilter`
 * (tal cual, con los `counts` de la API) escriben `?estado=`. Sin `cities` no hay filtro de ciudad y
 * sin `statusItems` no hay pills (listados del catálogo, CLGDC-126). Los enlaces de las pills se
 * interceptan para pasar por `onNavigate` (así el listado muestra su esqueleto mientras carga).
 *
 * @example
 * <LDCAdminListToolbar q="" city="" cities={cities} status="todos"
 *   statusItems={[{ key: "todos", label: "Todos", count: 45 }]} />
 */
export function LDCAdminListToolbar({
  q,
  city = "",
  cities,
  statusItems,
  status = "todos",
  allKey = "todos",
  onNavigate,
  searchLabel = "Buscar por nombre",
}: LDCAdminListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchId = useId();
  const cityId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(q);
  // Si `q` cambia desde fuera (p. ej. «Limpiar filtros»), el campo lo sigue (ajuste en el render,
  // sin `setState` dentro de un efecto).
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    if (q !== value.trim()) setValue(q);
  }

  /** URL con los cambios, desde `base` (por defecto los parámetros del render) y sin `page`. */
  function hrefWith(changes: Record<string, string>, base: string = searchParams.toString()) {
    const params = new URLSearchParams(base);
    params.delete("page");
    for (const [name, next] of Object.entries(changes)) {
      if (next) params.set(name, next);
      else params.delete(name);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(href: string) {
    if (onNavigate) onNavigate(href);
    else router.replace(href, { scroll: false });
  }

  useEffect(() => {
    const next = value.trim();
    if (next === q) return;
    const timer = setTimeout(() => {
      // La URL de este momento (no la del render en que empezó la espera): así no se pierde un
      // `?ciudad=` o `?estado=` elegido mientras corría el debounce.
      navigate(hrefWith({ q: next }, window.location.search));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // Lo disparan el texto y la `q` de la URL; `navigate` y `hrefWith` no cambian de comportamiento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, q]);

  function clearSearch() {
    setValue("");
    inputRef.current?.focus();
  }

  /** Las pills son enlaces: el clic simple pasa por `navigate`; Cmd/Ctrl + clic abre otra pestaña. */
  function interceptPill(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest("a");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(link.getAttribute("href") ?? pathname);
  }

  const cityItems = cities ? [{ id: "", name: "Todas las ciudades", slug: "" }, ...cities] : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <label htmlFor={searchId} className="sr-only">
            {searchLabel}
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            id={searchId}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`${searchLabel}…`}
            autoComplete="off"
            maxLength={200}
            className="h-11 bg-card pr-11 pl-9 md:h-9 md:pr-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={clearSearch}
              aria-label="Borrar búsqueda"
              className="absolute top-1/2 right-0.5 size-10 -translate-y-1/2 md:size-8"
            >
              <X aria-hidden />
            </Button>
          )}
        </div>
        {cityItems && (
          <div className="md:w-60">
            <label htmlFor={cityId} className="sr-only">
              Ciudad
            </label>
            <LDCCombobox
              id={cityId}
              items={cityItems}
              value={city}
              onValueChange={(slug) => navigate(hrefWith({ ciudad: slug }))}
              placeholder="Todas las ciudades"
              searchPlaceholder="Buscar ciudad…"
              emptyText="No encontramos esa ciudad."
              className="h-11 bg-card font-normal md:h-9 dark:bg-input/30"
            />
          </div>
        )}
      </div>
      {statusItems && statusItems.length > 0 && (
        <div onClickCapture={interceptPill}>
          <LDCStatusFilter
            current={status}
            items={statusItems.map((item) => ({
              ...item,
              href: hrefWith({ estado: item.key === allKey ? "" : item.key }),
            }))}
          />
        </div>
      )}
    </div>
  );
}
