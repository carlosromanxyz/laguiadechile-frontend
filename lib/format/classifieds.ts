/**
 * Pure, client-safe helpers for classifieds. No fetching / no server-only.
 */
import type { IClassified } from "@/interfaces/classified";

export function formatClassifiedPrice(price: IClassified["price"]): string {
  switch (price.type) {
    case "fixed":
      return `$${price.amount?.toLocaleString("es-CL")}`;
    case "free":
      return "Gratis";
    case "negotiable":
      return "A convenir";
    case "contact":
      return "Consultar";
    default:
      return "Consultar";
  }
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hace un momento";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"}`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `Hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
}
