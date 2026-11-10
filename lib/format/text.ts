/**
 * Helpers puros de texto. Sin fetch ni server-only: se pueden usar en el cliente.
 */

/** Quita tildes y diacríticos («Valparaíso» → «Valparaiso»). */
export function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Corta `text` a `max` caracteres como mucho, en el último espacio antes del límite, y agrega «…»
 * si cortó (el «…» cuenta dentro de `max`). Sin espacios antes del límite, corta en seco.
 */
export function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const room = text.slice(0, max - 1);
  const space = room.lastIndexOf(" ");
  const cut = (space > 0 ? room.slice(0, space) : room).replace(/[\s,;:.]+$/, "");
  return `${cut}…`;
}
