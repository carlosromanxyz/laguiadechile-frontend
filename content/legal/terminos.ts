import type { ILegalDocument } from "@/interfaces/legal";

/** Términos y condiciones de La Guía de Chile (texto plano, sin HTML; por ahora un placeholder). */
export const TERMS: ILegalDocument = {
  title: "Términos y condiciones",
  updatedAt: "2026-11-12",
  draft: true,
  sections: [
    {
      id: "se-completara-pronto",
      title: "Se completará pronto",
      paragraphs: ["Estamos preparando los términos y condiciones de La Guía de Chile. Este texto se completará pronto."],
    },
  ],
};
