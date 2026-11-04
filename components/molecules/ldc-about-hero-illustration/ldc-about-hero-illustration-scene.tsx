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
import {
  LDC_HERO_ENTRIES,
  LDC_HERO_LOOPS,
} from "./ldc-about-hero-illustration-timeline";

interface LDCAboutHeroIllustrationSceneProps {
  /** Nombre accesible de la ilustración (`role="img"`). */
  label: string;
  className?: string;
  /** Grupos del SVG (`data-e`, `data-l`, `data-lit`), renderizados en el servidor. */
  children: React.ReactNode;
}

/**
 * LDCAboutHeroIllustrationScene - Escena animada de la ilustración del hero (cliente)
 *
 * Pinta el `<svg>` con los grupos que recibe del servidor y los anima con
 * `useAnimate` de framer-motion según `ldc-about-hero-illustration-timeline`:
 * el armado empieza la primera vez que el 35 % del SVG entra en vista, y el
 * ciclo de día y noche se pausa fuera de la vista o con `LDCMotionPauseButton`.
 *
 * Sin hidratación con mismatch: el render no depende del cliente. Antes del
 * armado, una regla CSS (solo con `scripting: enabled` y
 * `prefers-reduced-motion: no-preference`) oculta los grupos, así no se ve la
 * ciudad completa, luego vacía y luego armada. Sin JavaScript o con
 * `prefers-reduced-motion: reduce` no se anima nada: queda la ciudad completa,
 * de día y sin ventanas encendidas.
 */
export function LDCAboutHeroIllustrationScene({
  label,
  className,
  children,
}: LDCAboutHeroIllustrationSceneProps) {
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
        // Pausada antes del armado: la ciudad completa, quieta
        svg.setAttribute("data-run", "");
        return;
      }
      started.current = true;
      // Punto de partida del armado, antes de soltar la regla CSS que oculta los grupos
      svg.querySelectorAll("[data-e]").forEach((el) => el.setAttribute("opacity", "0"));
      svg.setAttribute("data-run", "");
      for (const { selector, keyframes, options } of LDC_HERO_ENTRIES) {
        const c = animate(selector, keyframes, options);
        controls.current.push(c);
        // Al terminar sale de la lista: un play() posterior no debe repetir el armado
        c.then(() => {
          controls.current = controls.current.filter((x) => x !== c);
        });
      }
      for (const { selector, keyframes, options } of LDC_HERO_LOOPS) {
        controls.current.push(animate(selector, keyframes, options));
      }
      return;
    }

    for (const c of controls.current) {
      if (inView && !paused) c.play();
      else c.pause();
    }
  }, [animate, inView, paused, reduceMotion, scope]);

  return (
    <svg
      ref={scope}
      data-ldc-scene=""
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1047.79529 450.30891"
      className={cn(
        "[@media(scripting:enabled)]:motion-safe:[&:not([data-run])_[data-e]]:opacity-0",
        className,
      )}
    >
      {children}
    </svg>
  );
}

/** Reposo: sin transformaciones ni opacidades de la animación y ventanas apagadas. */
function resetScene(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGGElement>("[data-e], [data-l]").forEach((el) => {
    el.removeAttribute("opacity");
    el.style.removeProperty("transform");
    el.style.removeProperty("transform-origin");
    el.style.removeProperty("transform-box");
  });
  svg.querySelectorAll("[data-lit]").forEach((el) => el.setAttribute("opacity", "0"));
}
