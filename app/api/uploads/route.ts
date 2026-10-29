import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/api-client";
import { IMAGE_UPLOAD_MAX_BYTES, IMAGE_UPLOAD_TYPES } from "@/lib/uploads/image-upload";

const INTERNAL_BASE = process.env.INTERNAL_API_URL ?? "http://backend:3000/api";
/** Margen para las cabeceras del multipart sobre los 5 MB del archivo. */
const MAX_BODY_BYTES = IMAGE_UPLOAD_MAX_BYTES + 64 * 1024;

const json = (message: string, status: number) => NextResponse.json({ message }, { status });

function isSameHost(origin: string, host: string | null): boolean {
  try {
    return host !== null && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * POST /api/uploads — reenvía una imagen al backend (`POST /uploads`) con el JWT de la cookie
 * httpOnly `lgdc-auth`, que el navegador no puede leer.
 *
 * - Sin cookie, 401. Con un `Origin` de otro sitio, 403 (la cookie es `SameSite=Lax`, pero no
 *   cuesta nada cerrarlo aquí también).
 * - Se corta antes de leer el cuerpo si `Content-Length` falta o pasa de 5 MB (+ cabeceras): 411/413.
 * - Solo se reenvía el campo `file`. El tipo y el tamaño se revisan aquí para responder rápido; el
 *   backend vuelve a validar por los bytes iniciales (400), el tamaño (413) y el ritmo (429).
 * - No se reenvía `X-Forwarded-For`: Next 16 no expone la IP del socket en un route handler, y la
 *   cabecera entrante la escribe el cliente (Next solo la completa si no viene), así que copiarla
 *   permitiría falsear la IP con la que el backend limita. Ver el reporte de CLGDC-80.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && !isSameHost(origin, host)) return json("Origen no permitido", 403);

  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return json("Necesitas iniciar sesión para subir imágenes", 401);

  const length = Number(request.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0) return json("Falta Content-Length", 411);
  if (length > MAX_BODY_BYTES) return json("La imagen pesa más de 5 MB", 413);

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return json("Se esperaba un multipart con el campo file", 400);
  }
  if (!(file instanceof File)) return json("Falta el archivo (campo file)", 400);
  if (!(IMAGE_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return json("Formato no permitido: solo jpeg, png o webp", 400);
  }
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) return json("La imagen pesa más de 5 MB", 413);

  const body = new FormData();
  body.append("file", file, file.name);

  let res: Response;
  try {
    res = await fetch(`${INTERNAL_BASE}/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body,
      cache: "no-store",
    });
  } catch {
    return json("No pudimos conectar con el servidor de imágenes", 502);
  }

  const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const m = payload.message;
    const message = Array.isArray(m) ? m.join("; ") : typeof m === "string" ? m : "No se pudo subir";
    return json(message, res.status);
  }
  return NextResponse.json({ key: payload.key, url: payload.url }, { status: 201 });
}
