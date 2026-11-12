import type { ILegalDocument } from "@/interfaces/legal";

/** Políticas de privacidad de La Guía de Chile (texto plano, sin HTML; por ahora un placeholder). */
export const PRIVACY: ILegalDocument = {
  title: "Políticas de privacidad",
  updatedAt: "2026-11-12",
  draft: true,
  sections: [
    {
      id: "se-completara-pronto",
      title: "Se completará pronto",
      paragraphs: ["Estamos preparando las políticas de privacidad de La Guía de Chile. Este texto se completará pronto."],
    },
  ],
};
