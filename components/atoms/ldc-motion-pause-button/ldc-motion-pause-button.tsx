"use client";

import { Pause, Play } from "lucide-react";
import { useLDCMotionPause } from "@/components/shared/ldc-motion-pause-provider";
import { cn } from "@/lib/utils";

/**
 * LDCMotionPauseButton - Botón para pausar y reanudar las animaciones (WCAG 2.2.2)
 *
 * Pastilla redonda de 44×44 px que alterna la pausa del `LDCMotionPauseProvider`
 * más cercano. Es un botón de alternancia: la etiqueta es fija («Pausar
 * animación») y el estado lo dice `aria-pressed`; el ícono cambia de Pause a Play.
 * Con `prefers-reduced-motion: reduce` no hay nada que pausar y se oculta (por
 * CSS, sin diferencia de hidratación).
 *
 * Tonos:
 * - `overlay` (por defecto): ícono blanco sobre negro al 50 %, plano y sin blur
 *   (paleta plana, CLGDC-232): sobre la foto más clara (blanco) el ícono llega a
 *   ~4:1 (≥ 3:1). El foco es un anillo doble, blanco por fuera y negro por dentro,
 *   para garantizar el 3:1 sobre cualquier fondo.
 * - `ink`: como `overlay`, pero del color de `--ldc-hero-ink`, la tinta que
 *   sigue a la banda visible del hero de «Nosotros» (negra o blanca). El anillo
 *   de foco usa la tinta por fuera y negro por dentro.
 * - `surface`: sobre el fondo del tema (claro u oscuro), opaco, con borde y
 *   texto del tema. El hover oscurece en claro (`muted`) y aclara en oscuro (`input/50`,
 *   como el botón `outline` de shadcn), porque en oscuro `muted` y `accent`
 *   son más oscuros que el fondo. El foco es un anillo doble, del color del
 *   texto por fuera y del fondo por dentro.
 *
 * @example
 * <LDCMotionPauseButton />
 * <LDCMotionPauseButton tone="surface" />
 */
export function LDCMotionPauseButton({
  className,
  tone = "overlay",
}: {
  className?: string;
  /** Fondo sobre el que va el botón. @default "overlay" */
  tone?: "overlay" | "ink" | "surface";
}) {
  const { paused, toggle } = useLDCMotionPause();
  const Icon = paused ? Play : Pause;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label="Pausar animación"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border transition-colors focus-ring motion-reduce:hidden",
        tone === "overlay" &&
          "border-white/30 bg-black/50 text-white hover:bg-black/60",
        tone === "ink" &&
          "border-(--ldc-hero-ink)/30 bg-(--ldc-hero-ink)/15 text-(--ldc-hero-ink) hover:bg-(--ldc-hero-ink)/25",
        tone === "surface" &&
          "border-border bg-background text-foreground hover:bg-muted dark:hover:bg-input/50",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
