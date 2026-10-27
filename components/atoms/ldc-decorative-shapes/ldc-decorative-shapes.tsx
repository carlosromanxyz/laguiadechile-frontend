"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";

/**
 * LDCDecorativeShapes - Formas decorativas de las secciones de «Nosotros»
 *
 * Átomos puramente visuales (sin contenido ni semántica) que comparten los
 * organismos `ldc-about-*`: manchas difuminadas, acentos, barras y resplandores.
 *
 * Las formas flotan, giran o laten en loop, despacio y de forma sutil, con
 * framer-motion. El movimiento va en `transform` (inline), que se compone con
 * las propiedades `translate`, `rotate` y `scale` de las clases de Tailwind v4:
 * en reposo (y con `prefers-reduced-motion`) cada forma queda en la misma
 * posición, tamaño y color que sin animación.
 *
 * Las clases se arman concatenando cadenas, sin `cn`/`twMerge`: así la cadena
 * final es literal y predecible, y `twMerge` no puede descartar ninguna clase
 * que considere en conflicto.
 */

export type LDCDecorativeShapeVariant =
  | "blob"
  | "spot"
  | "corner"
  | "bar"
  | "glow";

interface LDCDecorativeShapeBaseProps {
  /**
   * Si es `false`, no añade `aria-hidden` (cuando la forma ya está dentro de
   * un `LDCDecorativeLayer`, que lo declara).
   * @default true
   */
  ariaHidden?: boolean;

  /**
   * Segundos de espera antes del primer ciclo, para desfasar las formas de una
   * misma sección.
   * @default 0
   */
  delay?: number;
}

interface LDCPositionedShapeProps extends LDCDecorativeShapeBaseProps {
  /**
   * Tipo de forma:
   * - `blob`: mancha circular grande (`rounded-full … blur-3xl`)
   * - `spot`: acento pequeño (`… blur-xl`); el redondeo va en `layout`
   * - `corner`: acento de esquina (`rounded-2xl bg-gradient-to-br … opacity-60 blur-md`)
   * - `bar`: barra vertical de 2 px (`w-2 rounded-full bg-gradient-to-b …`)
   */
  variant: Exclude<LDCDecorativeShapeVariant, "glow">;

  /**
   * Posición, tamaño y transformaciones (p. ej. `-left-40 -top-40 h-[600px] w-[600px]`).
   * En `spot` incluye además el redondeo; en `bar`, solo posición y alto (el ancho es fijo).
   */
  layout: string;

  /**
   * Relleno de la forma:
   * - `blob` y `spot`: color o degradado completo, con dirección
   *   (p. ej. `bg-yellow/20` o `bg-gradient-to-br from-purple/30 via-pink/20 to-transparent`)
   * - `corner` y `bar`: solo las paradas del degradado (p. ej. `from-pink to-purple`);
   *   la dirección la fija la variante (`to-br` y `to-b`)
   */
  fill: string;
}

interface LDCGlowShapeProps extends LDCDecorativeShapeBaseProps {
  /**
   * Resplandor detrás de una imagen (`absolute inset-0 -z-10 scale-110 … blur-2xl`);
   * siempre cubre a su contenedor, por eso no lleva `layout`.
   */
  variant: "glow";
  layout?: never;

  /**
   * Degradado completo, con dirección
   * (p. ej. `bg-gradient-to-tr from-yellow/30 via-orange/20 to-pink/20`).
   */
  fill: string;
}

type LDCDecorativeShapeProps = LDCPositionedShapeProps | LDCGlowShapeProps;

function shapeClassName(props: LDCDecorativeShapeProps): string {
  switch (props.variant) {
    case "blob":
      return `absolute ${props.layout} rounded-full ${props.fill} blur-3xl`;
    case "spot":
      return `absolute ${props.layout} ${props.fill} blur-xl`;
    case "corner":
      return `absolute ${props.layout} rounded-2xl bg-gradient-to-br ${props.fill} opacity-60 blur-md`;
    case "bar":
      return `absolute ${props.layout} w-2 rounded-full bg-gradient-to-b ${props.fill}`;
    case "glow":
      return `absolute inset-0 -z-10 scale-110 ${props.fill} blur-2xl`;
  }
}

/** Estado de reposo: el mismo en el render del servidor y en el del cliente. */
const SHAPE_REST = { x: 0, y: 0, rotate: 0, scale: 1 };

/**
 * Loop de cada variante: keyframes que vuelven al reposo y duración en segundos.
 * Solo `transform` (sin `opacity`, que pisaría el `opacity-60` de `corner`).
 */
const SHAPE_LOOPS: Record<
  LDCDecorativeShapeVariant,
  { animate: TargetAndTransition; duration: number }
> = {
  // Flota en diagonal y crece apenas
  blob: { animate: { x: [0, 16, 0], y: [0, -24, 0], scale: [1, 1.05, 1] }, duration: 14 },
  // Sube y gira unos grados
  spot: { animate: { y: [0, -12, 0], rotate: [0, 10, 0] }, duration: 9 },
  // Se mece
  corner: { animate: { y: [0, 6, 0], rotate: [0, -8, 0] }, duration: 10 },
  // Sube y baja
  bar: { animate: { y: [0, -10, 0] }, duration: 7 },
  // Late
  glow: { animate: { scale: [1, 1.05, 1] }, duration: 6 },
};

/**
 * Forma decorativa absoluta, animada en loop (quieta con `prefers-reduced-motion`).
 *
 * @example
 * <LDCDecorativeShape variant="glow" fill="bg-gradient-to-tr from-yellow/30 via-orange/20 to-pink/20" />
 */
export function LDCDecorativeShape(props: LDCDecorativeShapeProps) {
  const { ariaHidden = true, delay = 0 } = props;
  const reduceMotion = useReducedMotion();
  const loop = SHAPE_LOOPS[props.variant];

  return (
    <motion.div
      className={shapeClassName(props)}
      aria-hidden={ariaHidden ? "true" : undefined}
      initial={SHAPE_REST}
      animate={reduceMotion ? SHAPE_REST : loop.animate}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: loop.duration, delay, ease: "easeInOut", repeat: Infinity }
      }
    />
  );
}

/**
 * Capa de fondo que recorta y oculta a lectores de pantalla las formas que contiene.
 *
 * @example
 * <LDCDecorativeLayer>
 *   <LDCDecorativeShape variant="blob" ariaHidden={false} layout="..." fill="..." />
 * </LDCDecorativeLayer>
 */
export function LDCDecorativeLayer({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {children}
    </div>
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
