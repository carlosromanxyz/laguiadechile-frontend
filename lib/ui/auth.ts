/**
 * Clases compartidas por las pantallas de acceso (login, registro y repartidor `/ingresar`).
 */

/**
 * Enlace dentro de un texto: negrita y subrayado, sin cambiar el color del texto.
 * En claro, el hover solo engrosa el subrayado en rosa (el texto rosa no llega a 4,5:1 sobre
 * el fondo); en oscuro, el texto pasa a amarillo. El foco de teclado lleva un contorno del color
 * del texto.
 */
export const AUTH_INLINE_LINK_CLASS =
  "rounded-sm font-bold underline underline-offset-4 hover:decoration-pink hover:decoration-2 dark:hover:text-yellow dark:hover:decoration-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
