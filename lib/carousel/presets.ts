import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

/**
 * Presets de Embla repetidos en los carruseles del sitio.
 *
 * Las opciones son objetos constantes. Los plugins se crean con una función porque
 * cada instancia de Embla necesita su propio Autoplay/Fade (tienen estado).
 */

/** Carrusel en bucle: `{ loop: true }` */
export const CAROUSEL_LOOP_OPTIONS = { loop: true } as const;

/** Carrusel en bucle alineado al inicio: `{ align: "start", loop: true }` */
export const CAROUSEL_START_LOOP_OPTIONS = { align: "start", loop: true } as const;

/** Fundido + autoplay que no se detiene al interactuar */
export function createFadeAutoplayPlugins(delay: number) {
  return [Fade(), Autoplay({ delay, stopOnInteraction: false })];
}
