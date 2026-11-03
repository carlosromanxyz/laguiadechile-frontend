import type { ClassifiedPriceType, ClassifiedType, IClassified } from "./classified";
import type { IDashboardPublicationStatus } from "./dashboard";

/** Aviso propio (`/me/classifieds`): el aviso de siempre más su estado de moderación. */
export interface IMyClassified extends IClassified {
  status: IDashboardPublicationStatus;
  /** Motivo del rechazo que escribió el equipo (texto plano; solo con `rejected`). */
  rejectionReason?: string;
}

/**
 * Cuerpo de `POST /me/classifieds` y `PATCH /me/classifieds/:id` (el aviso queda en `REVIEW`).
 * `description` es texto plano (sin `<` ni `>`), como la pinta `/aviso/[slug]`.
 */
export interface IMyClassifiedInput {
  type: ClassifiedType;
  title: string;
  description: string;
  /** Opcional en el backend: `null` deja el aviso sin categoría. */
  categoryId: string | null;
  cityId: string;
  commune: string | null;
  priceType: ClassifiedPriceType;
  /** Solo con `priceType: "fixed"`; si no, `null`. En pesos, entero. */
  priceAmount: number | null;
  image: string;
  gallery: string[];
  sellerName: string | null;
  sellerPhone: string | null;
  sellerWhatsapp: string | null;
  sellerEmail: string | null;
}

/** Resultado de las server actions del aviso (no lanzan: el mensaje llega al formulario). */
export type IMyClassifiedResult = { ok: true; classified: IMyClassified } | { ok: false; message: string };
