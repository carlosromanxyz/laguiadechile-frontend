/**
 * GET/HEAD /media/<clave> — sirve las imágenes subidas desde el bucket (MinIO en local, que simula
 * R2) en el dominio del front. Así `next/image` las optimiza como rutas locales (sin
 * `remotePatterns`) y `localhost` no cambia entre el contenedor y el navegador. En prod, `/media`
 * pasa a ser el dominio propio del bucket R2 (`STORAGE_PUBLIC_URL`).
 *
 * Es un proxy en route handler y no un `rewrite` de `next.config.ts` porque Next no aplica
 * `headers()` a los rewrites externos (`resolve-routes` devuelve `resHeaders: null` cuando el
 * destino tiene protocolo), y aquí las cabeceras de seguridad y caché las pone Next.
 *
 * `MEDIA_UPSTREAM_URL`: origen del bucket con el nombre incluido (por defecto
 * `http://minio:9000/lgdc-media`, el MinIO del compose). A 5 s sin respuesta, 502.
 */
const MEDIA_UPSTREAM = (process.env.MEDIA_UPSTREAM_URL ?? "http://minio:9000/lgdc-media").replace(/\/+$/, "");

/** Cada segmento: letras, números, `.`, `_` y `-`; nunca `.` ni `..`. */
const SEGMENT = /^[A-Za-z0-9._-]+$/;

const SECURITY_HEADERS = {
  // El tipo lo fijó el backend al subir (validado por sus bytes): que el navegador no adivine otro.
  "X-Content-Type-Options": "nosniff",
  // Si alguna vez se abre directo, que no ejecute nada.
  "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
};

/** Cada clave es un UUID nuevo: el objeto nunca cambia. */
const CACHE_HIT = "public, max-age=31536000, immutable";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function notFound() {
  return new Response(null, {
    status: 404,
    headers: { ...SECURITY_HEADERS, "Cache-Control": "no-store" },
  });
}

async function serve(request: Request, path: string[], method: "GET" | "HEAD") {
  if (!path.length || path.some((s) => !SEGMENT.test(s) || s === "." || s === "..")) return notFound();

  const forward = new Headers();
  for (const name of ["if-none-match", "if-modified-since"]) {
    const value = request.headers.get(name);
    if (value) forward.set(name, value);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${MEDIA_UPSTREAM}/${path.map(encodeURIComponent).join("/")}`, {
      method,
      headers: forward,
      cache: "no-store",
      // Si el bucket no responde, que no queden peticiones colgadas.
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return new Response(null, { status: 502, headers: { ...SECURITY_HEADERS, "Cache-Control": "no-store" } });
  }

  if (upstream.status !== 200 && upstream.status !== 304) {
    // Sin `await`: con el fetch parchado de Next, esperar el `cancel()` deja la respuesta colgada.
    void upstream.body?.cancel().catch(() => {});
    return notFound();
  }

  const headers = new Headers({ ...SECURITY_HEADERS, "Cache-Control": CACHE_HIT });
  const type = upstream.headers.get("content-type") ?? "";
  headers.set("Content-Type", IMAGE_TYPES.has(type) ? type : "application/octet-stream");
  for (const name of ["content-length", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(method === "HEAD" || upstream.status === 304 ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: Ctx) {
  return serve(request, (await params).path, "GET");
}

export async function HEAD(request: Request, { params }: Ctx) {
  return serve(request, (await params).path, "HEAD");
}
