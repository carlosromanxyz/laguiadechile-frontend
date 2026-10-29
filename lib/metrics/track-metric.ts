import type { IMetricEvent, IMetricKind } from "@/interfaces/metric";

/** Tipos de evento que acepta `POST /metrics/events`. */
export const METRIC_KINDS: readonly IMetricKind[] = ["view", "whatsapp", "call", "web"];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** `true` si `value` es un uuid (cualquier versión). */
export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Valida el cuerpo de un evento (uuid y `kind` de la lista). */
export function isMetricEvent(value: unknown): value is IMetricEvent {
  if (!value || typeof value !== "object") return false;
  const { listingId, kind } = value as Record<string, unknown>;
  return (
    isUuid(listingId) &&
    typeof kind === "string" &&
    (METRIC_KINDS as readonly string[]).includes(kind)
  );
}

/** `true` si el navegador pide no rastrear (Do Not Track o Global Privacy Control). */
function trackingDisabled(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  const win = window as Window & { doNotTrack?: string };
  const dnt = nav.doNotTrack ?? win.doNotTrack;
  return nav.globalPrivacyControl === true || dnt === "1" || dnt === "yes";
}

/**
 * Envía un evento de métricas a `/api/metrics` sin bloquear la navegación.
 *
 * Usa `navigator.sendBeacon` y, si no está o lo rechaza, `fetch` con
 * `keepalive`. No hace nada en el servidor ni si el navegador tiene activo
 * Do Not Track o GPC. Nunca lanza.
 */
export function trackMetric(listingId: string, kind: IMetricKind): void {
  if (typeof window === "undefined" || trackingDisabled()) return;

  const body = JSON.stringify({ listingId, kind } satisfies IMetricEvent);

  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/metrics", blob)) return;
  } catch {
    // sigue con fetch
  }

  fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {});
}
