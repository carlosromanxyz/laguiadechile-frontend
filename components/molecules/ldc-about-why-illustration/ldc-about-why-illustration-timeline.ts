import {
  LDC_EASE_IN,
  LDC_EASE_OUT,
  LDC_EASE_STD,
  ldcSceneCycle,
  ldcSceneEntry,
  type LDCCycleStop,
  type LDCSceneAnimation,
} from "@/components/atoms/ldc-illustration-scene";

/**
 * Guion de la ilustración de «¿Por qué estar en La Guía de Chile?»: la lista de
 * beneficios se va llenando con checks.
 *
 * 1. Armado único (0–1450 ms): aparece el tablero, se trazan las 5 líneas y
 *    aparecen los 5 puntos, la casilla, la tarjeta y la persona.
 * 2. Ciclo de 19 s (primo: no se sincroniza con los 6/7/9/10/14 s de las formas,
 *    los 23 s del hero ni los 17 s de «¿Qué es…?»), infinito, desde los 1600 ms.
 *    En reposo hay 3 puntos marcados y 2 vacíos, como en la imagen original:
 *    - el brazo da un toque por ítem y se marcan el 4 y el 5 (cada punto se
 *      enciende con un latido);
 *    - con la lista completa late el check de la casilla, rebota la tarjeta y la
 *      persona asiente;
 *    - reinicio suave: los 5 puntos se apagan juntos y se vuelven a marcar el 1,
 *      el 2 y el 3, uno por toque, hasta quedar en el reposo;
 *    - la persona parpadea a los 6,2 s y dos veces seguidas a los 16,2 s.
 *
 * El SVG no trae lápiz: el brazo sale del hombro y señala la tarjeta de la
 * izquierda. Por eso el «marcar» es un toque del brazo, que gira en el hombro,
 * sincronizado con cada punto, en vez de un lápiz que recorra la lista.
 *
 * Solo `transform` y `opacity`; el ciclo empieza y termina en el reposo.
 */

const CYCLE_MS = 19000;
/** Duración del ciclo, en segundos. */
export const LDC_WHY_CYCLE_S = CYCLE_MS / 1000;
const CYCLE = { cycleMs: CYCLE_MS, delayS: 1.6 };

const CENTER: [number, number] = [0.5, 0.5];
const BOTTOM: [number, number] = [0.5, 1];
/** Hombro, como fracción de la caja del brazo (70,8–200 × 181,7–258,9). */
const SHOULDER: [number, number] = [0.95, 0.12];
/** Cuello, como fracción de la caja de la cabeza con el pelo. */
const NECK: [number, number] = [0.45, 0.95];

/** Inicio de cada toque del brazo; el punto se enciende 400 ms después. */
const TAPS = [1200, 2700, 10200, 11700, 13200];
const LIGHT_DELAY = 400;
/** Ítem (1–5) que marca cada toque. */
const TAP_ITEM = [4, 5, 1, 2, 3];
/** Reinicio suave: todos los puntos se apagan entre estos dos τ. */
const RESET_START = 8200;
const RESET_END = 9200;
/** La lista queda completa con el punto 5. */
const COMPLETE = TAPS[1] + LIGHT_DELAY;

const lightAt = (item: number) => TAPS[TAP_ITEM.indexOf(item)] + LIGHT_DELAY;

export const LDC_WHY_ENTRIES: LDCSceneAnimation[] = [
  ldcSceneEntry("board", { scale: [0.96, 1], opacity: [0, 1] }, { duration: 0.5, delayMs: 0, origin: BOTTOM }),
  ...[1, 2, 3, 4, 5].map((k) =>
    ldcSceneEntry(`line${k}`, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.4, delayMs: 250 + (k - 1) * 90, origin: [0, 0.5] }),
  ),
  ...[1, 2, 3, 4, 5].map((k) =>
    ldcSceneEntry(`dot${k}`, { scale: [0, 1], opacity: [0, 1] }, { duration: 0.4, delayMs: 450 + (k - 1) * 90, origin: CENTER }),
  ),
  ldcSceneEntry("card", { scale: [0.6, 1], opacity: [0, 1] }, { duration: 0.5, delayMs: 700, origin: BOTTOM }),
  ldcSceneEntry("tick", { scale: [0, 1], opacity: [0, 1] }, { duration: 0.4, delayMs: 900, origin: CENTER }),
  ldcSceneEntry("shadow", { opacity: [0, 1] }, { duration: 0.4, delayMs: 900 }),
  ldcSceneEntry("person", { y: [16, 0], opacity: [0, 1] }, { duration: 0.5, delayMs: 950, origin: BOTTOM }),
];

/** Brazo: sube 5°, presiona a −2° y vuelve, en cada toque. */
const armStops: LDCCycleStop[] = [
  [0, { rotate: 0 }],
  ...TAPS.flatMap((t): LDCCycleStop[] => [
    [t, { rotate: 0 }, LDC_EASE_STD],
    [t + 280, { rotate: 5 }, LDC_EASE_IN],
    [t + 430, { rotate: -2 }, LDC_EASE_STD],
    [t + 650, { rotate: 0 }],
  ]),
  [CYCLE_MS, { rotate: 0 }],
];

/** Latido del punto al encenderse. */
function dotPop(item: number): LDCSceneAnimation {
  const at = lightAt(item);
  return ldcSceneCycle(
    `[data-l="dot${item}"]`,
    [
      [0, { scale: 1 }],
      [at, { scale: 1 }, LDC_EASE_OUT],
      [at + 180, { scale: 1.28 }, LDC_EASE_STD],
      [at + 500, { scale: 1 }],
      [CYCLE_MS, { scale: 1 }],
    ],
    { ...CYCLE, origin: CENTER },
  );
}

/**
 * Copia del punto: en 4 y 5, el color se enciende con el toque y se apaga en el
 * reinicio; en 1–3, la tapa gris cubre el punto en el reinicio y se retira con el
 * toque.
 */
function dotCopy(item: number): LDCSceneAnimation {
  const at = lightAt(item);
  const stops: LDCCycleStop[] =
    item >= 4
      ? [
          [0, { opacity: 0 }],
          [at, { opacity: 0 }, LDC_EASE_OUT],
          [at + 300, { opacity: 1 }],
          [RESET_START, { opacity: 1 }, LDC_EASE_STD],
          [RESET_END, { opacity: 0 }],
          [CYCLE_MS, { opacity: 0 }],
        ]
      : [
          [0, { opacity: 0 }],
          [RESET_START, { opacity: 0 }, LDC_EASE_STD],
          [RESET_END, { opacity: 1 }],
          [at, { opacity: 1 }, LDC_EASE_OUT],
          [at + 300, { opacity: 0 }],
          [CYCLE_MS, { opacity: 0 }],
        ];
  return ldcSceneCycle(`[data-lit="dot${item}"]`, stops, CYCLE);
}

export const LDC_WHY_LOOPS: LDCSceneAnimation[] = [
  ldcSceneCycle('[data-l="arm"]', armStops, { ...CYCLE, origin: SHOULDER }),
  ...[1, 2, 3, 4, 5].flatMap((k) => [dotPop(k), dotCopy(k)]),
  // Lista completa: late el check de la casilla
  ldcSceneCycle(
    '[data-l="tick"]',
    [
      [0, { scale: 1 }],
      [COMPLETE + 300, { scale: 1 }, LDC_EASE_OUT],
      [COMPLETE + 550, { scale: 1.35 }, LDC_EASE_STD],
      [COMPLETE + 950, { scale: 1 }],
      [CYCLE_MS, { scale: 1 }],
    ],
    { ...CYCLE, origin: CENTER },
  ),
  // …rebota la tarjeta
  ldcSceneCycle(
    '[data-l="card"]',
    [
      [0, { y: 0 }],
      [COMPLETE + 500, { y: 0 }, LDC_EASE_OUT],
      [COMPLETE + 800, { y: -16 }, LDC_EASE_IN],
      [COMPLETE + 1050, { y: 0 }, LDC_EASE_OUT],
      [COMPLETE + 1250, { y: -6 }, LDC_EASE_IN],
      [COMPLETE + 1450, { y: 0 }],
      [CYCLE_MS, { y: 0 }],
    ],
    { ...CYCLE, origin: BOTTOM },
  ),
  // …y la persona asiente
  ldcSceneCycle(
    '[data-l="head"]',
    [
      [0, { rotate: 0 }],
      [COMPLETE + 600, { rotate: 0 }, LDC_EASE_STD],
      [COMPLETE + 950, { rotate: -4 }, LDC_EASE_STD],
      [COMPLETE + 1400, { rotate: 2 }, LDC_EASE_STD],
      [COMPLETE + 1800, { rotate: 0 }],
      [CYCLE_MS, { rotate: 0 }],
    ],
    { ...CYCLE, origin: NECK },
  ),
  // Parpadeo
  ldcSceneCycle(
    '[data-l="eyes"]',
    [
      [0, { scaleY: 1 }],
      ...[6200, 16200, 16600].flatMap((t): LDCCycleStop[] => [
        [t, { scaleY: 1 }, LDC_EASE_IN],
        [t + 100, { scaleY: 0.1 }, LDC_EASE_OUT],
        [t + 250, { scaleY: 1 }],
      ]),
      [CYCLE_MS, { scaleY: 1 }],
    ],
    { ...CYCLE, origin: CENTER },
  ),
];
