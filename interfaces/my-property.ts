import type { IAdminProperty, IAdminPropertyUpsert } from "./admin-catalog";
import type { IDashboardPublicationStatus } from "./dashboard";

/**
 * Propiedad propia (`/me/properties`, CLGDC-164): los campos de la API (los mismos que ve el admin)
 * más su estado de moderación. Las propiedades no vencen.
 */
export interface IMyProperty extends Omit<IAdminProperty, "status"> {
  status: IDashboardPublicationStatus;
  /** Motivo del rechazo que escribió el equipo (texto plano; solo con `rejected`). */
  rejectionReason?: string;
}

/**
 * Cuerpo de `POST /me/properties` y `PATCH /me/properties/:id` (la propiedad queda en `REVIEW`):
 * lo del admin sin `slug`, `featured` ni `isNew`, que pone el servidor o decide el equipo.
 */
export type IMyPropertyInput = Omit<IAdminPropertyUpsert, "slug" | "featured" | "isNew">;

/** Resultado de las server actions de la propiedad (no lanzan: el mensaje llega al formulario). */
export type IMyPropertyResult = { ok: true; property: IMyProperty } | { ok: false; message: string };
