/**
 * Descripción de una ficha: el backend la guarda como HTML mínimo (`<p>`, `<br>` y entidades) y
 * el comercio la edita como texto plano, con los párrafos separados por una línea en blanco.
 *
 * Helpers puros (sin I/O ni React): se usan en el formulario, en la vista previa y en la server
 * action. El HTML que sale de aquí siempre va escapado; nunca se pasa HTML del usuario tal cual.
 */

/** Máximo de `description` que acepta `PATCH /me/listings/:id`, ya convertido a HTML. */
export const DESCRIPTION_MAX_HTML = 5000;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Párrafos del texto del formulario: se separan por una línea en blanco; dentro de cada uno, los
 * saltos simples se conservan como líneas. Sin párrafos vacíos.
 */
export function descriptionParagraphs(text: string): string[][] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0);
}

/** HTML guardado → texto editable (párrafos separados por una línea en blanco). */
export function descriptionHtmlToText(html: string): string {
  const text = html
    .replace(/\r\n?/g, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  return decodeEntities(text)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Texto del formulario → HTML escapado: un `<p>` por párrafo y `<br>` por salto de línea. */
export function descriptionTextToHtml(text: string): string {
  return descriptionParagraphs(text)
    .map((lines) => `<p>${lines.map(escapeHtml).join("<br>")}</p>`)
    .join("");
}
