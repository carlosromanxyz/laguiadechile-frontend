import type { DOMKeyframesDefinition, Easing } from "framer-motion";

/**
 * Tipos y ayudas para los guiones de `LDCIllustrationScene`.
 *
 * Un guion son dos listas de animaciones de `useAnimate`: el armado (una sola vez)
 * y el ciclo (infinito). Solo `transform` y `opacity`. En SVG, framer-motion fija
 * el `transform-origin`, por eso el origen va como keyframe constante
 * (`originX`/`originY`, fracción de la caja del grupo).
 */

/** Salida suave. */
export const LDC_EASE_OUT: Easing = [0.22, 1, 0.36, 1];
/** Entrada acelerada. */
export const LDC_EASE_IN: Easing = [0.4, 0, 1, 1];
/** Estándar. */
export const LDC_EASE_STD: Easing = [0.4, 0, 0.2, 1];
export const LDC_LINEAR: Easing = "linear";

export interface LDCSceneAnimation {
  /** Selector dentro del `<svg>` de la escena. */
  selector: string;
  keyframes: DOMKeyframesDefinition;
  options: {
    duration: number;
    delay: number;
    ease: Easing | Easing[];
    times?: number[];
    repeat?: number;
  };
}

/** Armado de un grupo `data-e`: keyframes, duración (s), retraso (ms) y origen. */
export function ldcSceneEntry(
  id: string,
  keyframes: Record<string, number[]>,
  { duration, delayMs, origin = [0.5, 0.5] }: { duration: number; delayMs: number; origin?: [number, number] },
): LDCSceneAnimation {
  return {
    selector: `[data-e="${id}"]`,
    keyframes: { ...keyframes, originX: [origin[0], origin[0]], originY: [origin[1], origin[1]] },
    options: { duration, delay: delayMs / 1000, ease: LDC_EASE_OUT },
  };
}

/** Tramo del ciclo: τ en ms, valores y `ease` del tramo que empieza ahí. */
export type LDCCycleStop = [ms: number, values: Record<string, number>, ease?: Easing];

/**
 * Animación del ciclo: los tiempos van en ms dentro del ciclo (τ) y se pasan a
 * `times` (0–1); cada `ease` vale para el tramo que empieza en ese punto. El
 * primer y el último tramo tienen que ser el reposo, para que el loop no salte.
 */
export function ldcSceneCycle(
  selector: string,
  stops: LDCCycleStop[],
  {
    cycleMs,
    delayS,
    origin,
  }: { cycleMs: number; delayS: number; origin?: [number, number] },
): LDCSceneAnimation {
  const keys = Object.keys(stops[0][1]);
  const keyframes: Record<string, number[]> = {};
  for (const key of keys) keyframes[key] = stops.map(([, values]) => values[key]);
  if (origin) {
    keyframes.originX = stops.map(() => origin[0]);
    keyframes.originY = stops.map(() => origin[1]);
  }
  return {
    selector,
    keyframes,
    options: {
      duration: cycleMs / 1000,
      delay: delayS,
      times: stops.map(([ms]) => ms / cycleMs),
      ease: stops.slice(0, -1).map(([, , ease]) => ease ?? LDC_LINEAR),
      repeat: Infinity,
    },
  };
}
