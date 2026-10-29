"use client";

import { useId, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  markFavoritesSignedOut,
  setFavoriteSaved,
  useFavoriteIds,
} from "@/hooks/use-favorite-ids";
import type { IFavoriteKind, IFavoriteToggleResult } from "@/interfaces/favorite";
import { toggleFavoriteAction } from "@/lib/favorites/actions";
import { cn } from "@/lib/utils";

export interface LDCFavoriteButtonProps {
  /** Tipo de favorito de la API */
  kind: IFavoriteKind;
  /** Id (UUID) del comercio, aviso, propiedad o noticia */
  targetId: string;
  /** Título, para el nombre accesible y el toast de error */
  title: string;
  /**
   * `overlay`: corazón flotante arriba a la derecha de la foto de una card (el padre debe ser
   * `relative`, y el botón va como hermano del `Link` de la imagen, nunca dentro).
   * `pill`: «Guardar» / «Guardado» junto a «Compartir» en el hero de detalle.
   * @default "overlay"
   */
  variant?: "overlay" | "pill";
  className?: string;
}

const ANON_HINT = "Inicia sesión para guardar tus favoritos";

const VARIANT_CLASS = {
  overlay:
    "absolute top-2 right-2 z-20 size-10 sm:size-9 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-sm text-foreground hover:bg-card hover:scale-105",
  pill:
    "min-h-9 px-4 py-2 rounded-full bg-foreground/10 border border-foreground/20 text-foreground text-sm font-medium hover:bg-foreground/20 data-saved:bg-pink/10 data-saved:border-pink/60 dark:data-saved:bg-yellow/10 dark:data-saved:border-yellow/40",
} as const;

/** Tamaño del corazón y radio de la ráfaga (px) por variante. */
const ICON = {
  overlay: { className: "size-4.5", radius: 20 },
  pill: { className: "size-4", radius: 16 },
} as const;

/** Siete pares de puntos (grande + chico) repartidos en círculo, con los colores de marca. */
const BURST_COLORS = ["bg-pink", "bg-purple", "bg-orange", "bg-yellow"] as const;
const BURST = Array.from({ length: 7 }, (_, i) => {
  const angle = (i / 7) * 2 * Math.PI - Math.PI / 2;
  return {
    angle,
    big: BURST_COLORS[i % BURST_COLORS.length],
    small: BURST_COLORS[(i + 2) % BURST_COLORS.length],
  };
});

/** Duraciones de la animación al guardar (s): anillo, corazón y puntos suman ~0,75 s. */
const RING: Transition = { duration: 0.45, times: [0, 0.55, 1], ease: "easeOut" };
const HEART: Transition = { duration: 0.55, times: [0, 0.3, 0.65, 0.85, 1], ease: "easeOut" };
const DOTS: Transition = { duration: 0.5, delay: 0.25, ease: "easeOut" };

/**
 * Anillo que se expande y desvanece, y la corona de puntos que sale hacia afuera (estilo X).
 * Solo `transform` y `opacity`; se monta una vez por cada clic que guarda.
 */
function LDCFavoriteBurst({ radius }: { radius: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <motion.span
        className="absolute -inset-1/2 rounded-full border-2 border-purple"
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: [0, 1, 1.15], opacity: [0.9, 0.9, 0] }}
        transition={RING}
      />
      {BURST.map(({ angle, big, small }) => (
        <span key={angle}>
          <motion.span
            className={cn("absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] size-1.5 rounded-full", big)}
            initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              scale: [1, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={DOTS}
          />
          <motion.span
            className={cn("absolute left-1/2 top-1/2 -ml-0.5 -mt-0.5 size-1 rounded-full", small)}
            initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
            animate={{
              x: Math.cos(angle + 0.35) * radius * 0.75,
              y: Math.sin(angle + 0.35) * radius * 0.75,
              scale: [1, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={DOTS}
          />
        </span>
      ))}
    </span>
  );
}

/**
 * LDCFavoriteButton - Guardar o quitar un favorito desde el sitio público
 *
 * `overlay` (sin texto): toggle con `aria-pressed` y `aria-label` fijo. `pill`: sin
 * `aria-pressed`; el nombre accesible empieza con el texto visible («Guardar «X» en favoritos»
 * o «Guardado: quitar «X» de favoritos», WCAG 2.5.3). El estado inicial sale de `useFavoriteIds()`
 * (mientras carga, `aria-disabled` y `opacity-50`). Al hacer clic cambia al instante
 * (`useOptimistic`) y llama a `toggleFavoriteAction`; si falla, vuelve atrás y avisa con
 * `toast.error`. Sin sesión, el tooltip invita a iniciar sesión y el clic lleva a
 * `/dashboard/login?next=<ruta actual>`.
 *
 * Al guardar: anillo, corazón que crece con rebote y ráfaga de puntos (~0,75 s, una vez); al
 * quitar, el corazón solo se desvanece. Con `prefers-reduced-motion`, cambio directo.
 *
 * @example
 * <LDCFavoriteButton kind="LISTING" targetId={listing.id} title={listing.title} />
 * <LDCFavoriteButton kind="NEWS" targetId={news.id} title={news.title} variant="pill" />
 */
export function LDCFavoriteButton({
  kind,
  targetId,
  title,
  variant = "overlay",
  className,
}: LDCFavoriteButtonProps) {
  const router = useRouter();
  const hintId = useId();
  const reduceMotion = useReducedMotion();
  const { loading, authenticated, isSaved } = useFavoriteIds();
  const [saved, setOptimisticSaved] = useOptimistic(isSaved(kind, targetId));
  const [pending, startTransition] = useTransition();
  // Cuenta los clics que guardan: cada uno vuelve a montar la animación.
  const [popKey, setPopKey] = useState(0);

  const anonymous = !loading && !authenticated;
  const pop = popKey > 0 && !reduceMotion;
  const icon = ICON[variant];
  const isPill = variant === "pill";
  const label =
    isPill && saved ? `Guardado: quitar «${title}» de favoritos` : `Guardar «${title}» en favoritos`;

  function goToLogin() {
    const next = `${window.location.pathname}${window.location.search}`;
    router.push(`/dashboard/login?next=${encodeURIComponent(next)}`);
  }

  function handleClick() {
    if (loading || pending) return;
    if (!authenticated) {
      goToLogin();
      return;
    }
    const nextSaved = !saved;
    if (nextSaved) setPopKey((key) => key + 1);
    startTransition(async () => {
      setOptimisticSaved(nextSaved);
      // Sin red, la server action lanza: se trata como un error más (revierte y avisa),
      // para que no llegue al error boundary de la página.
      const result: IFavoriteToggleResult = await toggleFavoriteAction(
        kind,
        targetId,
        nextSaved,
      ).catch(() => ({ ok: false, reason: "error", message: "" }) as const);
      if (result.ok) {
        setFavoriteSaved(kind, targetId, nextSaved);
        return;
      }
      if (result.reason === "auth") {
        markFavoritesSignedOut();
        goToLogin();
        return;
      }
      toast.error(
        nextSaved
          ? `No pudimos guardar «${title}». Intenta de nuevo.`
          : `No pudimos quitar «${title}» de tus favoritos. Intenta de nuevo.`,
      );
    });
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            aria-pressed={isPill ? undefined : saved}
            data-saved={(isPill && saved) || undefined}
            aria-label={label}
            aria-busy={pending || undefined}
            aria-disabled={loading || undefined}
            aria-describedby={anonymous ? hintId : undefined}
            className={cn(
              "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 transition-[background-color,opacity,transform] duration-150 motion-reduce:transition-none motion-reduce:hover:scale-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              "aria-busy:cursor-progress aria-busy:opacity-70 aria-disabled:cursor-wait aria-disabled:opacity-50",
              VARIANT_CLASS[variant],
              className,
            )}
          >
            <span aria-hidden className={cn("relative inline-block", icon.className)}>
              <Heart
                className={cn(
                  "absolute inset-0 size-full transition-opacity duration-150",
                  saved && "opacity-0",
                )}
              />
              <AnimatePresence initial={false}>
                {saved && (
                  <motion.span
                    key={`filled-${popKey}`}
                    className="absolute inset-0 text-pink dark:text-yellow"
                    initial={pop ? { scale: 0, opacity: 0 } : false}
                    animate={
                      pop
                        ? { scale: [0, 0, 1.25, 0.95, 1], opacity: [0, 0, 1, 1, 1] }
                        : { scale: 1, opacity: 1 }
                    }
                    exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
                    transition={pop ? HEART : { duration: 0 }}
                  >
                    <Heart className="size-full fill-current" />
                  </motion.span>
                )}
              </AnimatePresence>
              {saved && pop && <LDCFavoriteBurst key={popKey} radius={icon.radius} />}
            </span>
            {isPill && <span>{saved ? "Guardado" : "Guardar"}</span>}
          </button>
        </TooltipTrigger>
        {anonymous && <TooltipContent side="bottom">{ANON_HINT}</TooltipContent>}
      </Tooltip>
      {/* Fuera del botón (hermano), para pantallas táctiles sin tooltip */}
      {anonymous && (
        <span id={hintId} className="sr-only">
          {ANON_HINT}
        </span>
      )}
    </>
  );
}
