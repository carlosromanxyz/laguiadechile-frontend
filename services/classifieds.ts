import { IClassified, IClassifieds, ClassifiedType } from "@/interfaces/classified";
import classifiedsData from "@/data/classifieds.json";

/**
 * Get all classifieds
 * @returns Array of all classified listings
 */
export function getClassifieds(): IClassifieds {
  return classifiedsData as IClassifieds;
}

/**
 * Get featured classifieds only
 * @returns Array of featured classified listings
 */
export function getFeaturedClassifieds(): IClassifieds {
  return classifiedsData.filter((item) => item.featured) as IClassifieds;
}

/**
 * Get recent classifieds sorted by creation date (most recent first)
 * @param limit - Number of listings to return (default: 12)
 * @returns Array of recent classified listings
 */
export function getRecentClassifieds(limit: number = 12): IClassifieds {
  return [...classifiedsData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IClassifieds;
}

/**
 * Get classified by slug
 * @param slug - Classified slug
 * @returns Classified listing or undefined
 */
export function getClassifiedBySlug(slug: string): IClassified | undefined {
  return classifiedsData.find((item) => item.slug === slug) as IClassified | undefined;
}

/**
 * Get classifieds by type (vendo, compro, arriendo, busco, ofrezco)
 * @param type - Classified type
 * @returns Array of classified listings of that type
 */
export function getClassifiedsByType(type: ClassifiedType): IClassifieds {
  return classifiedsData.filter((item) => item.type === type) as IClassifieds;
}

/**
 * Get classifieds by category slug
 * @param categorySlug - Category slug
 * @returns Array of classified listings in that category
 */
export function getClassifiedsByCategory(categorySlug: string): IClassifieds {
  return classifiedsData.filter(
    (item) => item.category.slug === categorySlug
  ) as IClassifieds;
}

/**
 * Get classifieds by city slug
 * @param citySlug - City slug
 * @returns Array of classified listings in that city
 */
export function getClassifiedsByCity(citySlug: string): IClassifieds {
  return classifiedsData.filter((item) => item.city.slug === citySlug) as IClassifieds;
}

/**
 * Format price for display
 * @param price - Price object
 * @returns Formatted price string
 */
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

/**
 * Get relative time string (e.g., "Hace 2 horas")
 * @param dateString - ISO date string
 * @returns Relative time string in Spanish
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Hace un momento";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `Hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
}
