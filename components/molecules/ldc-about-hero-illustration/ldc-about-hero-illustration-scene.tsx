"use client";

import { LDCIllustrationScene } from "@/components/atoms/ldc-illustration-scene";
import {
  LDC_HERO_ENTRIES,
  LDC_HERO_LOOPS,
} from "./ldc-about-hero-illustration-timeline";

interface LDCAboutHeroIllustrationSceneProps {
  /** Nombre accesible de la ilustración (`role="img"`). */
  label: string;
  className?: string;
  /** Grupos del SVG (`data-e`, `data-l`, `data-lit`), renderizados en el servidor. */
  children: React.ReactNode;
}

/**
 * LDCAboutHeroIllustrationScene - Escena animada de la ilustración del hero (cliente)
 *
 * `LDCIllustrationScene` con el guion de `ldc-about-hero-illustration-timeline`:
 * el armado empieza la primera vez que el 35 % del SVG entra en vista, y el
 * ciclo de día y noche se pausa fuera de la vista o con `LDCMotionPauseButton`.
 * Sin JavaScript o con `prefers-reduced-motion: reduce` queda la ciudad
 * completa, de día y sin ventanas encendidas.
 */
export function LDCAboutHeroIllustrationScene({
  label,
  className,
  children,
}: LDCAboutHeroIllustrationSceneProps) {
  return (
    <LDCIllustrationScene
      label={label}
      viewBox="0 0 1047.79529 450.30891"
      entries={LDC_HERO_ENTRIES}
      loops={LDC_HERO_LOOPS}
      className={className}
    >
      {children}
    </LDCIllustrationScene>
  );
}
