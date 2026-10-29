/**
 * Estado de publicación del backend (`PublicationStatus` de Prisma) → estado del panel.
 * Helper puro: sin I/O ni React.
 */
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";

const STATUS_MAP: Readonly<Record<string, IDashboardPublicationStatus>> = {
  PUBLISHED: "published",
  REVIEW: "review",
  REJECTED: "rejected",
  EXPIRED: "expired",
};

/**
 * Un aviso PUBLISHED con `expiresAt` pasado cuenta como vencido: ya no se muestra en el sitio.
 * Un estado desconocido se trata como «en revisión» (no se muestra como publicado).
 */
export function toPublicationStatus(
  status: string | null | undefined,
  expiresAt?: string | null,
  now = Date.now(),
): IDashboardPublicationStatus {
  const mapped = (status && STATUS_MAP[status]) || "review";
  if (mapped === "published" && expiresAt && new Date(expiresAt).getTime() < now) return "expired";
  return mapped;
}
