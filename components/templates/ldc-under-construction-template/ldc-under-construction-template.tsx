import { LDCUnderConstruction } from "@/components/organisms/ldc-under-construction";

/**
 * LDCUnderConstructionTemplate - Estructura de la página «En construcción»
 *
 * Server Component sin datos. El marco (franja de precaución, centrado y pie)
 * lo pone `app/en-construccion/layout.tsx`; este template renderiza el bloque
 * central animado.
 *
 * @example
 * <LDCUnderConstructionTemplate />
 */
export function LDCUnderConstructionTemplate() {
  return <LDCUnderConstruction />;
}
