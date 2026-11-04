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
 * El foco es un anillo doble, blanco por fuera y negro por dentro: sobre el
 * degradado del hero el blanco solo llega a ~3,1:1 en la zona orange-red, y el
 * negro garantiza el 3:1 sobre cualquier fondo.
 *
 * @example
 * <LDCMotionPauseButton />
 */
export function LDCMotionPauseButton({ className }: { className?: string }) {
  const { paused, toggle } = useLDCMotionPause();
  const Icon = paused ? Play : Pause;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label="Pausar animación"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:hidden",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
