"use client";

import { LDCIllustrationScene } from "@/components/atoms/ldc-illustration-scene";
import {
  LDC_WHY_ENTRIES,
  LDC_WHY_LOOPS,
} from "./ldc-about-why-illustration-timeline";

interface LDCAboutWhyIllustrationSceneProps {
  /** Nombre accesible de la ilustración (`role="img"`). */
  label: string;
  className?: string;
  /** Grupos del SVG (`data-e`, `data-l`, `data-lit`), renderizados en el servidor. */
  children: React.ReactNode;
}

/**
 * LDCAboutWhyIllustrationScene - Escena animada de «¿Por qué…?» (cliente)
 *
 * `LDCIllustrationScene` con el guion de `ldc-about-why-illustration-timeline`:
 * armado al entrar en vista y ciclo de la lista de 19 s, que se pausa fuera de la
 * vista o con `LDCMotionPauseButton`.
 */
export function LDCAboutWhyIllustrationScene({
  label,
  className,
  children,
}: LDCAboutWhyIllustrationSceneProps) {
  return (
    <LDCIllustrationScene
      label={label}
      viewBox="0 0 679.6657 650.59919"
      entries={LDC_WHY_ENTRIES}
      loops={LDC_WHY_LOOPS}
      className={className}
    >
      {children}
    </LDCIllustrationScene>
  );
}
