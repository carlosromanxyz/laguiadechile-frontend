"use client";

import { LDCIllustrationScene } from "@/components/atoms/ldc-illustration-scene";
import {
  LDC_WHAT_ENTRIES,
  LDC_WHAT_LOOPS,
} from "./ldc-about-what-illustration-timeline";

interface LDCAboutWhatIllustrationSceneProps {
  /** Nombre accesible de la ilustración (`role="img"`). */
  label: string;
  className?: string;
  /** Grupos del SVG (`data-e`, `data-l`, `data-lit`), renderizados en el servidor. */
  children: React.ReactNode;
}

/**
 * LDCAboutWhatIllustrationScene - Escena animada de «¿Qué es…?» (cliente)
 *
 * `LDCIllustrationScene` con el guion de `ldc-about-what-illustration-timeline`:
 * armado al entrar en vista y ciclo de búsqueda de 17 s, que se pausa fuera de la
 * vista o con `LDCMotionPauseButton`.
 */
export function LDCAboutWhatIllustrationScene({
  label,
  className,
  children,
}: LDCAboutWhatIllustrationSceneProps) {
  return (
    <LDCIllustrationScene
      label={label}
      viewBox="0 0 412.23999 608.19"
      entries={LDC_WHAT_ENTRIES}
      loops={LDC_WHAT_LOOPS}
      className={className}
    >
      {children}
    </LDCIllustrationScene>
  );
}
