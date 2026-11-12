import type { IImageCredit } from "@/interfaces/image-credit";

interface LDCImageCreditsProps {
  /** Créditos de `getImageCredits()` (solo las fotos que piden atribución) */
  credits: IImageCredit[];
}

/** Enlace externo de texto: AA en ambos temas y foco visible. */
const linkClass =
  "rounded-sm text-pink-strong underline underline-offset-2 hover:no-underline dark:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

/**
 * LDCImageCredits - Lista de texto con los créditos de las fotos (CLGDC-210)
 *
 * Cada línea: «Título — Autor · Licencia (enlace) · Ver en Commons (enlace)».
 * Sin imágenes; los enlaces abren en otra pestaña. Si no hay créditos, lo dice.
 *
 * @example
 * ```tsx
 * <LDCImageCredits credits={await getImageCredits()} />
 * ```
 */
export function LDCImageCredits({ credits }: LDCImageCreditsProps) {
  if (credits.length === 0) {
    return <p className="text-sm text-muted-foreground">Por ahora no hay créditos de imágenes por mostrar.</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-foreground">
      {credits.map((credit, i) => (
        <li key={`${credit.filePage ?? credit.title}-${i}`} className="leading-relaxed [overflow-wrap:anywhere]">
          <span className="font-semibold">{credit.title}</span>
          {" — "}
          {credit.author}
          {" · "}
          {credit.licenseUrl ? (
            <a href={credit.licenseUrl} target="_blank" rel="license noopener noreferrer" className={linkClass}>
              {credit.license}
            </a>
          ) : (
            credit.license
          )}
          {credit.filePage && (
            <>
              {" · "}
              <a href={credit.filePage} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Ver en Commons
              </a>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
