/** Ruta interna: `/` seguido de algo que no sea `/` ni `\` (o solo `/`), sin control ni `\`. */
const INTERNAL_PATH = /^\/(?![/\\])/;
const FORBIDDEN_CHARS = /[\u0000-\u001f\u007f\\]/;

/** Mismos rechazos para la cadena cruda y para el pathname ya normalizado. */
function isInternalPath(path: string): boolean {
  return INTERNAL_PATH.test(path) && !FORBIDDEN_CHARS.test(path);
}

/**
 * Destino `?next=` del login, solo si es una ruta interna relativa.
 *
 * Sin I/O ni React: se usa en la página de login (servidor) y en `LDCLoginForm` (cliente).
 * Rechaza todo lo que pueda salir del sitio (open redirect): URLs absolutas (`https:`,
 * `javascript:`), protocolo relativo (`//evil.cl`, `/\evil.cl`), caracteres de control y
 * rutas que no empiezan con `/`. Los rechazos se repiten sobre el `pathname` que deja
 * `new URL`, porque la normalización puede convertir `/..//evil.cl` en `//evil.cl`.
 * También descarta volver al propio login. Devuelve la ruta normalizada o `null`.
 */
export function safeNextPath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 512) return null;
  if (!isInternalPath(raw)) return null;

  const base = "http://ldc.invalid";
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.origin !== base) return null;
  if (!isInternalPath(url.pathname)) return null;
  if (url.pathname === "/dashboard/login") return null;
  return `${url.pathname}${url.search}${url.hash}`;
}
