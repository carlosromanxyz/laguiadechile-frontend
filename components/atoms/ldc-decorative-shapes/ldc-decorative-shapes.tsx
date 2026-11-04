"use client";

import {
  motion,
  useAnimate,
  useReducedMotion,
  type AnimationPlaybackControls,
  type DOMKeyframesDefinition,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useLDCMotionPause } from "@/components/shared/ldc-motion-pause-provider";

/**
 * LDCDecorativeShapes - Formas decorativas de las secciones de «Nosotros»
 *
 * Átomos puramente visuales (sin contenido ni semántica) que comparten los
 * organismos `ldc-about-*`: la barra vertical de acento y la fila de barras
 * horizontales. Son de color plano y sin blur: el sitio usa colores planos, y
 * las manchas, acentos de esquina y resplandores difuminados que había antes
 * se leían como degradados.
 *
 * La barra vertical sube y baja en loop, despacio, con framer-motion. El
 * movimiento va en `transform` (inline), que se compone con las propiedades
 * `translate` de las clases de Tailwind v4: en reposo (y con
 * `prefers-reduced-motion`) queda en la misma posición que sin animación.
 *
 * El loop se arranca con `useAnimate` para poder congelarlo en su sitio cuando
 * el `LDCMotionPauseProvider` que lo envuelve está en pausa (WCAG 2.2.2).
 *
 * Las clases se arman concatenando cadenas, sin `cn`/`twMerge`: así la cadena
 * final es literal y predecible, y `twMerge` no puede descartar ninguna clase
 * que considere en conflicto.
 */

export type LDCDecorativeShapeVariant = "bar";

interface LDCDecorativeShapeProps {
  /** Tipo de forma: `bar`, barra vertical de 2 px (`w-2 rounded-full …`). */
  variant: LDCDecorativeShapeVariant;

  /**
   * Segundos de espera antes del primer ciclo, para desfasar las formas de una
   * misma sección.
   * @default 0
   */
  delay?: number;

  /** Posición y alto (p. ej. `-left-4 top-8 h-32`); el ancho es fijo. */
  layout: string;

  /** Relleno: un color plano de la paleta (p. ej. `bg-purple`). */
  fill: string;
}

/** Estado de reposo: el mismo en el render del servidor y en el del cliente. */
const SHAPE_REST = { x: 0, y: 0, rotate: 0, scale: 1 };

/** Loop de cada variante: keyframes que vuelven al reposo y duración en segundos. */
const SHAPE_LOOPS: Record<
  LDCDecorativeShapeVariant,
  { animate: DOMKeyframesDefinition; duration: number }
> = {
  // Sube y baja
  bar: { animate: { y: [0, -10, 0] }, duration: 7 },
};

/**
 * Forma decorativa absoluta, animada en loop (quieta con `prefers-reduced-motion`).
 *
 * @example
 * <LDCDecorativeShape variant="bar" layout="-left-4 top-8 h-32" fill="bg-purple" />
 */
export function LDCDecorativeShape({ delay = 0, variant, layout, fill }: LDCDecorativeShapeProps) {
  const reduceMotion = useReducedMotion();
  const { paused } = useLDCMotionPause();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const loop = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!scope.current) return;
    if (reduceMotion) {
      animate(scope.current, SHAPE_REST, { duration: 0 });
      return;
    }
    const { animate: keyframes, duration } = SHAPE_LOOPS[variant];
    const controls = animate(scope.current, keyframes, {
      duration,
      delay,
      ease: "easeInOut",
      repeat: Infinity,
    });
    loop.current = controls;
    return () => {
      controls.stop();
      loop.current = null;
    };
  }, [animate, delay, reduceMotion, scope, variant]);

  useEffect(() => {
    if (paused) loop.current?.pause();
    else loop.current?.play();
  }, [paused, reduceMotion]);

  return (
    <motion.div
      ref={scope}
      className={`absolute ${layout} w-2 rounded-full ${fill}`}
      aria-hidden="true"
      initial={SHAPE_REST}
    />
  );
}

export interface LDCAccentBar {
  /** Ancho de la barra (p. ej. `w-16`) */
  width: string;
  /** Relleno de la barra (p. ej. `bg-white/60`) */
  fill: string;
}

/**
 * Fila de barras horizontales de acento, de 4 px de alto.
 *
 * @example
 * <LDCAccentBars bars={[{ width: "w-16", fill: "bg-white/60" }]} />
 */
export function LDCAccentBars({ bars }: { bars: LDCAccentBar[] }) {
  return (
    <div className="flex gap-2 pt-4" aria-hidden="true">
      {bars.map((bar, index) => (
        <div key={index} className={`h-1 ${bar.width} rounded-full ${bar.fill}`} />
      ))}
    </div>
  );
}
