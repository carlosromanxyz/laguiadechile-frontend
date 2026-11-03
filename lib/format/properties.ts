/**
 * Pure, client-safe helpers for properties. No fetching / no server-only.
 */
import type { IProperty, PropertyType, PropertyOperation } from "@/interfaces/property";

export function formatPropertyPrice(price: IProperty["price"]): string {
  if (price.currency === "uf") {
    const amount = price.amount.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return `UF ${amount}`;
  }
  return `$${price.amount.toLocaleString("es-CL")}`;
}

export function formatPropertyPriceWithPeriod(price: IProperty["price"]): string {
  const base = formatPropertyPrice(price);
  if (price.period) {
    const labels = { mes: "/mes", dia: "/día", semana: "/semana" } as const;
    return `${base}${labels[price.period]}`;
  }
  return base;
}

export function formatCommonExpenses(amount?: number): string {
  if (!amount || amount === 0) return "";
  return `+ $${amount.toLocaleString("es-CL")} GC`;
}

/** Tipos en los que los dormitorios tienen sentido (terrenos, oficinas, locales y bodegas no). */
const TYPES_WITH_BEDROOMS: readonly PropertyType[] = ["casa", "departamento"];
/** Tipos en los que los baños y estacionamientos tienen sentido (un terreno no los tiene). */
const TYPES_WITH_BUILDING: readonly PropertyType[] = [
  "casa",
  "departamento",
  "oficina",
  "local",
  "bodega",
];

/**
 * Dormitorios, baños y estacionamientos a mostrar: undefined si el dato no viene
 * informado o no aplica al tipo de propiedad (así no se pinta «0 dormitorios» en un terreno).
 */
export function getPropertyRooms(
  type: PropertyType,
  features: Pick<IProperty["features"], "bedrooms" | "bathrooms" | "parking">,
): { bedrooms?: number; bathrooms?: number; parking?: number } {
  const hasBuilding = TYPES_WITH_BUILDING.includes(type);
  return {
    bedrooms: TYPES_WITH_BEDROOMS.includes(type) ? features.bedrooms : undefined,
    bathrooms: hasBuilding ? features.bathrooms : undefined,
    parking: hasBuilding ? features.parking : undefined,
  };
}

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

export function getOperationLabel(operation: PropertyOperation): string {
  const labels: Record<PropertyOperation, string> = {
    venta: "Venta",
    arriendo: "Arriendo",
    "arriendo-temporal": "Arriendo temporal",
  };
  return labels[operation];
}
