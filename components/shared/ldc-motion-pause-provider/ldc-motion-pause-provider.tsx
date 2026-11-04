"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * LDCMotionPauseProvider - Pausa compartida de las animaciones de una sección
 *
 * Mecanismo de pausa (WCAG 2.2.2) para todo lo que se mueve dentro: lo leen
 * `LDCDecorativeShape`, `LDCIllustrationScene` (ilustraciones de «Nosotros») y
 * `LDCMotionPauseButton`, que la alterna. Fuera de un provider nada está en pausa.
 *
 * Envuelve a sus hijos en un `div` con `display: contents` (no cambia el layout)
 * que lleva `data-ldc-motion-paused="true"` en pausa, para congelar también las
 * animaciones CSS con la variante `in-data-[ldc-motion-paused=true]:`.
 *
 * @example
 * <LDCMotionPauseProvider>
 *   <section>…<LDCMotionPauseButton /></section>
 * </LDCMotionPauseProvider>
 */

interface LDCMotionPauseValue {
  /** `true` si el usuario pausó las animaciones. */
  paused: boolean;
  /** Alterna la pausa. */
  toggle: () => void;
}

const LDCMotionPauseContext = createContext<LDCMotionPauseValue>({
  paused: false,
  toggle: () => {},
});

export function LDCMotionPauseProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  const toggle = useCallback(() => setPaused((p) => !p), []);
  const value = useMemo(() => ({ paused, toggle }), [paused, toggle]);

  return (
    <LDCMotionPauseContext.Provider value={value}>
      <div className="contents" data-ldc-motion-paused={paused ? "true" : undefined}>
        {children}
      </div>
    </LDCMotionPauseContext.Provider>
  );
}

/** Estado de pausa del `LDCMotionPauseProvider` más cercano. */
export function useLDCMotionPause(): LDCMotionPauseValue {
  return useContext(LDCMotionPauseContext);
}
