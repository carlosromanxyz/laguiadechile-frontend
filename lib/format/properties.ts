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
