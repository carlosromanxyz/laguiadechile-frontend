import {
  LDC_EASE_IN as EASE_IN,
  LDC_EASE_OUT as EASE_OUT,
  LDC_EASE_STD as EASE_STD,
  ldcSceneCycle,
  ldcSceneEntry,
  type LDCCycleStop,
  type LDCSceneAnimation,
} from "@/components/atoms/ldc-illustration-scene";

/**
 * Guion de la variante «C2 · Día y noche» de la ilustración del hero de «Nosotros»
 * (lienzo `docs/lienzos/CLGDC-180-ilustraciones-animadas.html`).
 *
 * 1. Armado único (0–1450 ms), escalonado: suelo y calzada, edificios, árboles y
 *    arbustos, ventanas cada 35 ms, sol y cielo, gente y conos.
 * 2. Ciclo de 23 s, infinito, desde los 1400 ms: día, atardecer, noche con las
 *    ventanas encendidas y amanecer.
 *
 * Solo `transform` y `opacity`. Los tiempos del ciclo van en ms dentro del ciclo
 * (τ) y se pasan a `times` (0–1) de framer-motion; cada `ease` vale para el tramo
 * que empieza en ese punto, como el `animation-timing-function` de los keyframes CSS.
 */

const CYCLE_MS = 23000;
/** Duración del ciclo de día y noche, en segundos. */
export const LDC_HERO_CYCLE_S = CYCLE_MS / 1000;
/** El ciclo arranca a los 1400 ms, cuando el armado casi terminó. */
export const LDC_HERO_CYCLE_DELAY_S = 1.4;

type EntryKind = "drawX" | "rise" | "grow" | "fade" | "fadeSlow" | "riseSun" | "fadeUp" | "pop";

/** Keyframes, duración (s) y origen (fracción de la caja del grupo) de cada tipo de entrada. */
const ENTRY_KINDS: Record<
  EntryKind,
  { keyframes: Record<string, number[]>; duration: number; origin: [number, number] }
> = {
  // El suelo se dibuja de izquierda a derecha
  drawX: { keyframes: { scaleX: [0, 1], opacity: [0, 1] }, duration: 0.4, origin: [0, 0.5] },
  // Los edificios suben 28 u
  rise: { keyframes: { y: [28, 0], opacity: [0, 1] }, duration: 0.5, origin: [0.5, 1] },
  // Árboles y arbustos crecen desde la base
  grow: { keyframes: { scale: [0.7, 1], opacity: [0, 1] }, duration: 0.5, origin: [0.5, 1] },
  fade: { keyframes: { opacity: [0, 1] }, duration: 0.4, origin: [0.5, 0.5] },
  fadeSlow: { keyframes: { opacity: [0, 1] }, duration: 0.6, origin: [0.5, 0.5] },
  riseSun: { keyframes: { y: [24, 0], opacity: [0, 1] }, duration: 0.6, origin: [0.5, 0.5] },
  fadeUp: { keyframes: { y: [8, 0], opacity: [0, 1] }, duration: 0.4, origin: [0.5, 1] },
  // Los conos aparecen de golpe
  pop: { keyframes: { scale: [0, 1], opacity: [0, 1] }, duration: 0.4, origin: [0.5, 1] },
};

/** Grupo `data-e`, tipo de entrada y retraso en ms. */
const ENTRY_PLAN: Array<[string, EntryKind, number]> = [
  ["ground", "drawX", 0],
  ["bldA", "rise", 100],
  ["bldB", "rise", 200],
  ["dash42", "fade", 250],
  ["tree1", "grow", 300],
  ["dash43", "fade", 310],
  ["dash44", "fade", 370],
  ["tree2", "grow", 380],
  ["sky", "fadeSlow", 400],
  // Ventanas de bldA (23–32) y bldB (37–40), cada 35 ms
  ...Array.from({ length: 10 }, (_, k): [string, EntryKind, number] => [`win${23 + k}`, "fade", 450 + k * 35]),
  ...Array.from({ length: 4 }, (_, k): [string, EntryKind, number] => [`win${37 + k}`, "fade", 600 + k * 35]),
  ["tree3", "grow", 460],
  ["sun", "riseSun", 500],
  ["tree4", "grow", 540],
  ["bushL1", "grow", 650],
  ["bushL2", "grow", 700],
  ["bushR1", "grow", 700],
  ["bushR2", "grow", 750],
  ["shadow", "fade", 800],
  ["bench", "fadeUp", 850],
  ["signPole", "fadeUp", 900],
  ["signBoard", "fadeUp", 900],
  ["crutch", "fadeUp", 900],
  ["worker1", "fadeUp", 950],
  ["phoneW", "fadeUp", 950],
  ["walker", "fadeUp", 1000],
  ["worker2", "fadeUp", 1000],
  ["cones", "pop", 1050],
];

/** Armado único. El origen va como keyframe constante para que framer-motion no lo pise. */
export const LDC_HERO_ENTRIES: LDCSceneAnimation[] = ENTRY_PLAN.map(([id, kind, delayMs]) => {
  const { keyframes, duration, origin } = ENTRY_KINDS[kind];
  return ldcSceneEntry(id, keyframes, { duration, delayMs, origin });
});

/** Tramo del ciclo de 23 s, desde los 1400 ms. */
function cycle(selector: string, stops: LDCCycleStop[]): LDCSceneAnimation {
  return ldcSceneCycle(selector, stops, { cycleMs: CYCLE_MS, delayS: LDC_HERO_CYCLE_DELAY_S });
}

const AT_REST = { y: 0, opacity: 1 };
const CREW_OUT = { y: 4, opacity: 0 };

/** Workers, conos y sombra: salen 9600–10200 y vuelven 21000–21600. */
function crew(id: string): LDCSceneAnimation {
  return cycle(`[data-l="${id}"]`, [
    [0, AT_REST],
    [9600, AT_REST, EASE_STD],
    [10200, CREW_OUT],
    [21000, CREW_OUT, EASE_STD],
    [21600, AT_REST],
    [CYCLE_MS, AT_REST],
  ]);
}

/**
 * Ventana k (0–9 de bldA, 10–13 de bldB): se enciende en 9000 + k·80 y se apaga en
 * el amanecer, 19500 + k·60; las ventanas 3 y 8 se apagan antes (14000 y 16500).
 * Cada cambio dura 400 ms.
 */
function lit(k: number): LDCSceneAnimation {
  const on = 9000 + k * 80;
  const off = k === 3 ? 14000 : k === 8 ? 16500 : 19500 + k * 60;
  return cycle(`[data-lit="${k}"]`, [
    [0, { opacity: 0 }],
    [on, { opacity: 0 }, EASE_OUT],
    [on + 400, { opacity: 1 }],
    [off, { opacity: 1 }, EASE_IN],
    [off + 400, { opacity: 0 }],
    [CYCLE_MS, { opacity: 0 }],
  ]);
}

/** Ciclo de día y noche (grupos `data-l` y copias `data-lit`). */
export const LDC_HERO_LOOPS: LDCSceneAnimation[] = [
  // Atardecer 8000–9500: el sol baja 60 u y se apaga; sale en el amanecer, 19500–21000
  cycle('[data-l="sun"]', [
    [0, AT_REST],
    [8000, AT_REST, EASE_IN],
    [9500, { y: 60, opacity: 0 }],
    [19500, { y: 60, opacity: 0 }, EASE_OUT],
    [21000, AT_REST],
    [CYCLE_MS, AT_REST],
  ]),
  // El cielo baja a 0.45 en el atardecer y vuelve con el sol
  cycle('[data-l="sky"]', [
    [0, { opacity: 1 }],
    [8000, { opacity: 1 }, EASE_STD],
    [9500, { opacity: 0.45 }],
    [19500, { opacity: 0.45 }, EASE_STD],
    [21000, { opacity: 1 }],
    [CYCLE_MS, { opacity: 1 }],
  ]),
  // De día la caminante cruza hacia la izquierda, lineal, y se desvanece; vuelve al amanecer
  cycle('[data-l="walker"]', [
    [0, { x: 0, opacity: 1 }],
    [500, { x: 0, opacity: 1 }],
    [7100, { x: -100, opacity: 1 }],
    [7500, { x: -110, opacity: 0 }],
    [7600, { x: 0, opacity: 0 }],
    [21500, { x: 0, opacity: 0 }, EASE_OUT],
    [22300, { x: 0, opacity: 1 }],
    [CYCLE_MS, { x: 0, opacity: 1 }],
  ]),
  crew("worker1"),
  crew("worker2"),
  crew("cones"),
  crew("shadow"),
  // phoneW sale por la derecha (10000–10600) y vuelve por la izquierda (20500–21100)
  cycle('[data-l="phoneW"]', [
    [0, { x: 0, opacity: 1 }],
    [10000, { x: 0, opacity: 1 }, EASE_STD],
    [10600, { x: 12, opacity: 0 }],
    [20500, { x: -12, opacity: 0 }, EASE_OUT],
    [21100, { x: 0, opacity: 1 }],
    [CYCLE_MS, { x: 0, opacity: 1 }],
  ]),
  ...Array.from({ length: 14 }, (_, k) => lit(k)),
];
