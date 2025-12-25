import {
  IProperty,
  IProperties,
  PropertyType,
  PropertyOperation,
} from "@/interfaces/property";
import propertiesData from "@/data/properties.json";

/**
 * Get all properties
 * @returns Array of all property listings
 */
export function getProperties(): IProperties {
  return propertiesData as IProperties;
}

/**
 * Get featured properties only
 * @returns Array of featured property listings
 */
export function getFeaturedProperties(): IProperties {
  return propertiesData.filter((item) => item.featured) as IProperties;
}

/**
 * Get recent properties sorted by creation date (most recent first)
 * @param limit - Number of properties to return (default: 12)
 * @returns Array of recent property listings
 */
export function getRecentProperties(limit: number = 12): IProperties {
  return [...propertiesData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IProperties;
}

/**
 * Get property by slug
 * @param slug - Property slug
 * @returns Property listing or undefined
 */
export function getPropertyBySlug(slug: string): IProperty | undefined {
  return propertiesData.find((item) => item.slug === slug) as IProperty | undefined;
}

/**
 * Get properties by type (casa, departamento, terreno, etc.)
 * @param type - Property type
 * @returns Array of property listings of that type
 */
export function getPropertiesByType(type: PropertyType): IProperties {
  return propertiesData.filter((item) => item.type === type) as IProperties;
}

/**
 * Get properties by operation (venta, arriendo, arriendo-temporal)
 * @param operation - Property operation
 * @returns Array of property listings with that operation
 */
export function getPropertiesByOperation(operation: PropertyOperation): IProperties {
  return propertiesData.filter((item) => item.operation === operation) as IProperties;
}

/**
 * Get properties by commune
 * @param commune - Commune name
 * @returns Array of property listings in that commune
 */
export function getPropertiesByCommune(commune: string): IProperties {
  return propertiesData.filter(
    (item) => item.location.commune.toLowerCase() === commune.toLowerCase()
  ) as IProperties;
}

/**
 * Format property price for display
 * @param price - Price object
 * @returns Formatted price string
 */
export function formatPropertyPrice(price: IProperty["price"]): string {
  if (price.currency === "uf") {
    // Format UF with dots as thousand separator
    const formattedAmount = price.amount.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return `UF ${formattedAmount}`;
  } else {
    // Format CLP
    return `$${price.amount.toLocaleString("es-CL")}`;
  }
}

/**
 * Format price with period (for rentals)
 * @param price - Price object
 * @returns Formatted price string with period
 */
export function formatPropertyPriceWithPeriod(price: IProperty["price"]): string {
  const basePrice = formatPropertyPrice(price);

  if (price.period) {
    const periodLabels = {
      mes: "/mes",
      dia: "/día",
      semana: "/semana",
    };
    return `${basePrice}${periodLabels[price.period]}`;
  }

  return basePrice;
}

/**
 * Format common expenses
 * @param amount - Amount in CLP
 * @returns Formatted string or empty if no expenses
 */
export function formatCommonExpenses(amount?: number): string {
  if (!amount || amount === 0) return "";
  return `+ $${amount.toLocaleString("es-CL")} GC`;
}

/**
 * Get property type label in Spanish
 * @param type - Property type
 * @returns Spanish label
 */
export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    casa: "Casa",
    departamento: "Departamento",
    terreno: "Terreno",
    oficina: "Oficina",
    local: "Local comercial",
    bodega: "Bodega",
  };
  return labels[type];
}

/**
 * Get operation label in Spanish
 * @param operation - Property operation
 * @returns Spanish label
 */
export function getOperationLabel(operation: PropertyOperation): string {
  const labels: Record<PropertyOperation, string> = {
    venta: "Venta",
    arriendo: "Arriendo",
    "arriendo-temporal": "Arriendo temporal",
  };
  return labels[operation];
}
