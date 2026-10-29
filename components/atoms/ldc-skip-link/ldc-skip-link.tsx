export interface LDCSkipLinkProps {
  /** Id del contenido principal, sin `#` (por defecto `contenido`) */
  targetId?: string;
  /** Texto del enlace */
  label?: string;
}

/**
 * LDCSkipLink - Enlace «Saltar al contenido»
 *
 * Primer elemento enfocable de la página (WCAG 2.4.1): oculto hasta recibir el foco con el
 * teclado; entonces aparece arriba a la izquierda, sobre todo lo demás, y lleva al `<main>`.
 *
 * @example
 * <LDCSkipLink />
 * <main id="contenido" tabIndex={-1}>…</main>
 */
export function LDCSkipLink({ targetId = "contenido", label = "Saltar al contenido" }: LDCSkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-md bg-background px-4 py-2 text-sm font-bold text-foreground shadow-lg outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {label}
    </a>
  );
}
