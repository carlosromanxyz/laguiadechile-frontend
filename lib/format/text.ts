/**
 * Helpers puros de texto. Sin fetch ni server-only: se pueden usar en el cliente.
 */

/** Quita tildes y diacríticos («Valparaíso» → «Valparaiso»). */
export function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
