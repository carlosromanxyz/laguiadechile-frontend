import Link from "next/link";
import type { ReactNode } from "react";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCThemeModeToggler } from "@/components/molecules/ldc-theme-mode-toggler";
import { cn } from "@/lib/utils";

export interface LDCAuthTemplateProps {
  /** Slot central: el bloque del formulario (p. ej. `LDCAuthCard` + `LDCLoginForm`) */
  children: ReactNode;
  /**
   * Portada opcional (p. ej. `LDCAuthCover`). Con ella, la pantalla se divide en
   * dos columnas desde `lg` y la portada queda fija al alto de la ventana; bajo
   * `lg` se oculta. Sin ella, el formulario ocupa todo el ancho.
   */
  aside?: ReactNode;
}

/**
 * LDCAuthTemplate - Esqueleto de las páginas de acceso (bloque `login-02` adaptado)
 *
 * Server Component sin datos. Columna del formulario con barra superior (logo
 * enlazado al inicio y cambio de tema), el slot centrado en `max-w-sm` con una
 * entrada de 0,3 s (solo con `prefers-reduced-motion: no-preference`) y el enlace
 * de vuelta al sitio; y, si llega, la portada a la derecha desde `lg`.
 *
 * @example
 * <LDCAuthTemplate aside={<LDCAuthCover listing={featured} stats={stats} />}>
 *   <LDCAuthCard bare role="admin" title="…"><LDCLoginForm role="admin" /></LDCAuthCard>
 * </LDCAuthTemplate>
 */
export function LDCAuthTemplate({ children, aside }: LDCAuthTemplateProps) {
  return (
    <div className={cn("grid min-h-svh", aside != null && "lg:grid-cols-2")}>
      <div className="flex flex-col gap-4 bg-background p-6 md:p-10">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="La Guía de Chile, ir al inicio" className="rounded-full">
            <LDCLogo isotipoSize="xs" />
          </Link>
          <LDCThemeModeToggler />
        </div>
        <main className="flex flex-1 items-start justify-center pt-4 md:items-center md:pt-0">
          <div className="w-full max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]">
            {children}
          </div>
        </main>
        <p className="text-center font-open-sans text-xs text-muted-foreground md:text-left">
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-pink dark:hover:text-yellow"
          >
            Volver a La Guía de Chile
          </Link>
        </p>
      </div>
      {aside != null && <div className="sticky top-0 hidden h-svh lg:block">{aside}</div>}
    </div>
  );
}
