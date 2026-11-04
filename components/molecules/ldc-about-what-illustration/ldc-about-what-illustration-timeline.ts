import {
  LDC_EASE_OUT,
  LDC_EASE_STD,
  ldcSceneCycle,
  ldcSceneEntry,
  type LDCCycleStop,
  type LDCSceneAnimation,
} from "@/components/atoms/ldc-illustration-scene";

/**
 * Guion de la ilustración de «¿Qué es La Guía de Chile?»: la persona busca con la
 * lupa en el celular.
 *
 * 1. Armado único (0–1200 ms): el suelo se dibuja, sube el celular, entra la
 *    persona desde la izquierda y aparece la lupa.
 * 2. Ciclo de 17 s (primo: no se sincroniza con los 6/7/9/10/14 s de las formas
 *    ni con los 23 s del hero), infinito, desde los 1300 ms: la lupa recorre la
 *    pantalla (arriba a la izquierda, al centro a la derecha, abajo), la persona
 *    inclina la cabeza siguiéndola, y en la última parada la lupa «encuentra»:
 *    se ajusta, emite un pulso y se ilumina, y la persona da un respingo. Luego
 *    la lupa vuelve a su sitio.
 *
 * Solo `transform` y `opacity`; el ciclo empieza y termina en el reposo.
 */

const CYCLE_MS = 17000;
/** Duración del ciclo, en segundos. */
export const LDC_WHAT_CYCLE_S = CYCLE_MS / 1000;
const CYCLE = { cycleMs: CYCLE_MS, delayS: 1.3 };

/** Centro de la lente como fracción de la caja de la lupa (204–351 × 255–402). */
const LENS_ORIGIN: [number, number] = [0.32, 0.32];
/** Cuello de la persona como fracción de la caja de la cabeza con el pelo. */
const NECK_ORIGIN: [number, number] = [0.45, 0.95];

/** Hallazgo: la lupa llega a la última parada a los 8800 ms. */
const FOUND = 8800;

export const LDC_WHAT_ENTRIES: LDCSceneAnimation[] = [
  ldcSceneEntry("floor", { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.5, delayMs: 0, origin: [0, 0.5] }),
  ldcSceneEntry("phone", { y: [40, 0], opacity: [0, 1] }, { duration: 0.6, delayMs: 100, origin: [0.5, 1] }),
  ldcSceneEntry("person", { x: [-24, 0], opacity: [0, 1] }, { duration: 0.6, delayMs: 350, origin: [0.5, 1] }),
  ldcSceneEntry("lens", { scale: [0.6, 1], opacity: [0, 1] }, { duration: 0.5, delayMs: 700, origin: LENS_ORIGIN }),
];

/** Paradas de la lupa (traslación) y de la cabeza (giro) en cada una. */
const REST = { x: 0, y: 0 };
const STOP_A = { x: -28, y: -150 }; // arriba a la izquierda
const STOP_B = { x: 42, y: -60 }; // al centro, a la derecha
const STOP_C = { x: 14, y: 112 }; // abajo: el hallazgo
const HEAD_A = -5; // mira hacia arriba
const HEAD_B = -2;
const HEAD_C = 6; // mira hacia abajo
const HEAD_AFTER = 4; // tras el respingo

/** τ de salida (ida desde la parada anterior) y de llegada a cada parada. */
const LEAVE_REST = 900;
const AT_A = 3000;
const LEAVE_A = 3800;
const AT_B = 5900;
const LEAVE_B = 6700;
/** Vuelta a su sitio desde la parada C. */
const LEAVE_C = 11200;
const BACK = 13600;

const lensStops: LDCCycleStop[] = [
  [0, { ...REST, scale: 1 }],
  [LEAVE_REST, { ...REST, scale: 1 }, LDC_EASE_STD],
  [AT_A, { ...STOP_A, scale: 1 }],
  [LEAVE_A, { ...STOP_A, scale: 1 }, LDC_EASE_STD],
  [AT_B, { ...STOP_B, scale: 1 }],
  [LEAVE_B, { ...STOP_B, scale: 1 }, LDC_EASE_STD],
  [FOUND, { ...STOP_C, scale: 1 }, LDC_EASE_OUT],
  [FOUND + 350, { ...STOP_C, scale: 1.08 }, LDC_EASE_STD],
  [FOUND + 700, { ...STOP_C, scale: 1 }],
  [LEAVE_C, { ...STOP_C, scale: 1 }, LDC_EASE_STD],
  [BACK, { ...REST, scale: 1 }],
  [CYCLE_MS, { ...REST, scale: 1 }],
];

const headStops: LDCCycleStop[] = [
  [0, { rotate: 0, y: 0 }],
  [LEAVE_REST, { rotate: 0, y: 0 }, LDC_EASE_STD],
  [AT_A, { rotate: HEAD_A, y: 0 }],
  [LEAVE_A, { rotate: HEAD_A, y: 0 }, LDC_EASE_STD],
  [AT_B, { rotate: HEAD_B, y: 0 }],
  [LEAVE_B, { rotate: HEAD_B, y: 0 }, LDC_EASE_STD],
  [FOUND, { rotate: HEAD_C, y: 0 }],
  [FOUND + 400, { rotate: HEAD_C, y: 0 }, LDC_EASE_OUT],
  // Respingo
  [FOUND + 650, { rotate: 2, y: -5 }, LDC_EASE_STD],
  [FOUND + 1100, { rotate: HEAD_AFTER, y: 0 }],
  [LEAVE_C, { rotate: HEAD_AFTER, y: 0 }, LDC_EASE_STD],
  [BACK, { rotate: 0, y: 0 }],
  [CYCLE_MS, { rotate: 0, y: 0 }],
];

export const LDC_WHAT_LOOPS: LDCSceneAnimation[] = [
  ldcSceneCycle('[data-l="lens"]', lensStops, { ...CYCLE, origin: LENS_ORIGIN }),
  ldcSceneCycle('[data-l="head"]', headStops, { ...CYCLE, origin: NECK_ORIGIN }),
  // Pulso: el anillo crece desde la lente y se desvanece
  ldcSceneCycle(
    '[data-lit="ring"]',
    [
      [0, { opacity: 0, scale: 1 }],
      [FOUND + 400, { opacity: 0, scale: 1 }, LDC_EASE_OUT],
      [FOUND + 500, { opacity: 0.8, scale: 1 }, LDC_EASE_OUT],
      [FOUND + 1500, { opacity: 0, scale: 1.7 }],
      [FOUND + 1550, { opacity: 0, scale: 1 }],
      [CYCLE_MS, { opacity: 0, scale: 1 }],
    ],
    { ...CYCLE, origin: [0.5, 0.5] },
  ),
  // La lente se ilumina
  ldcSceneCycle(
    '[data-lit="glint"]',
    [
      [0, { opacity: 0 }],
      [FOUND + 400, { opacity: 0 }, LDC_EASE_OUT],
      [FOUND + 650, { opacity: 0.22 }, LDC_EASE_STD],
      [FOUND + 1800, { opacity: 0 }],
      [CYCLE_MS, { opacity: 0 }],
    ],
    CYCLE,
  ),
];
