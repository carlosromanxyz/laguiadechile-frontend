"use client";

import {
  useAnimate,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useLDCMotionPause } from "@/components/shared/ldc-motion-pause-provider";
import { cn } from "@/lib/utils";
import type { LDCSceneAnimation } from "./ldc-illustration-timeline";

interface LDCIllustrationSceneProps {
  /** Nombre accesible de la ilustración (`role="img"`). */
  label: string;
  /** `viewBox` del SVG. */
  viewBox: string;
  /** Armado único, que arranca la primera vez que la escena entra en vista. */
  entries: LDCSceneAnimation[];
  /** Ciclo infinito, que se pausa fuera de la vista o con `LDCMotionPauseButton`. */
  loops: LDCSceneAnimation[];
  className?: string;
  /** Grupos del SVG (`data-e`, `data-l`, `data-lit`), renderizados en el servidor. */
  children: React.ReactNode;
}

/**
 * LDCIllustrationScene - Escena SVG animada con framer-motion (cliente)
 *
 * Pinta el `<svg>` con los grupos que recibe del servidor y los anima con
 * `useAnimate` según el guion que recibe: el armado empieza la primera vez que el
 * 35 % del SVG entra en vista, y el ciclo se pausa fuera de la vista o con el
 * `LDCMotionPauseProvider` de la sección.
 *
 * Convenciones de los grupos:
 * - `data-e`: grupo del armado (se oculta antes de armar).
 * - `data-l`: grupo anidado del ciclo, para que la entrada y el loop no se pisen.
 * - `data-lit`: copia apagada en reposo (`opacity` 0) que el ciclo enciende.
 *
 * Sin hidratación con mismatch: el render no depende del cliente. Antes del
 * armado, una regla CSS (solo con `scripting: enabled` y
 * `prefers-reduced-motion: no-preference`) oculta los grupos `data-e`. Sin
 * JavaScript o con `prefers-reduced-motion: reduce` no se anima nada: queda la
 * ilustración en reposo, idéntica a la estática.
 *
 * @example
 * <LDCIllustrationScene label="…" viewBox="0 0 100 100" entries={E} loops={L}>
 *   <g data-e="a">…</g>
 * </LDCIllustrationScene>
 */
export function LDCIllustrationScene({
  label,
  viewBox,
  entries,
  loops,
  className,
  children,
}: LDCIllustrationSceneProps) {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const inView = useInView(scope, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const { paused } = useLDCMotionPause();
  const controls = useRef<AnimationPlaybackControls[]>([]);
  const started = useRef(false);

  useEffect(() => {
    const svg = scope.current;
    if (!svg) return;

    if (reduceMotion) {
      // Pasó a movimiento reducido con la escena andando: vuelve al reposo
      if (started.current) {
        for (const c of controls.current) c.stop();
        controls.current = [];
        started.current = false;
        resetScene(svg);
      }
      return;
    }

    if (!started.current) {
      if (!inView) return;
      if (paused) {
        // Pausada antes del armado: la ilustración completa, quieta
        svg.setAttribute("data-run", "");
        return;
      }
      started.current = true;
      // Punto de partida del armado, antes de soltar la regla CSS que oculta los grupos
      svg.querySelectorAll("[data-e]").forEach((el) => el.setAttribute("opacity", "0"));
      svg.setAttribute("data-run", "");
      for (const { selector, keyframes, options } of entries) {
        const c = animate(selector, keyframes, options);
        controls.current.push(c);
        // Al terminar sale de la lista: un play() posterior no debe repetir el armado
        c.then(() => {
          controls.current = controls.current.filter((x) => x !== c);
        });
      }
      for (const { selector, keyframes, options } of loops) {
        controls.current.push(animate(selector, keyframes, options));
      }
      return;
    }

    for (const c of controls.current) {
      if (inView && !paused) c.play();
      else c.pause();
    }
  }, [animate, entries, inView, loops, paused, reduceMotion, scope]);

  return (
    <svg
      ref={scope}
      data-ldc-scene=""
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={cn(
        "[@media(scripting:enabled)]:motion-safe:[&:not([data-run])_[data-e]]:opacity-0",
        className,
      )}
    >
      {children}
    </svg>
  );
}

/** Reposo: sin transformaciones ni opacidades de la animación y copias apagadas. */
function resetScene(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGGElement>("[data-e], [data-l]").forEach((el) => {
    el.removeAttribute("opacity");
    el.style.removeProperty("transform");
    el.style.removeProperty("transform-origin");
    el.style.removeProperty("transform-box");
  });
  svg.querySelectorAll<SVGElement>("[data-lit]").forEach((el) => {
    el.setAttribute("opacity", "0");
    el.style.removeProperty("transform");
    el.style.removeProperty("transform-origin");
    el.style.removeProperty("transform-box");
  });
}
