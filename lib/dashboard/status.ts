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
  ARCHIVED: "archived",
};

/**
 * Un aviso PUBLISHED con `expiresAt` pasado cuenta como vencido: ya no se muestra en el sitio.
 * Un estado desconocido se trata como «en revisión» (no se muestra como publicado ni ofrece
 * acciones de un estado que no tiene, como «Desarchivar») y se avisa en la consola del servidor
 * con el valor crudo, para notar un estado nuevo del backend que falte mapear.
 */
export function toPublicationStatus(
  status: string | null | undefined,
  expiresAt?: string | null,
  now = Date.now(),
): IDashboardPublicationStatus {
  const known = status ? STATUS_MAP[status] : undefined;
  if (!known) console.warn(`toPublicationStatus: estado sin mapear ${JSON.stringify(status)}; se muestra «en revisión»`);
  const mapped = known ?? "review";
  if (mapped === "published" && expiresAt && new Date(expiresAt).getTime() < now) return "expired";
  return mapped;
}
