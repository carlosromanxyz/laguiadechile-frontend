/**
 * Tipos propios de la simulación del panel. Se mantienen aparte de los tipos reales
 * (`IListingDetail`, `IClassified`…) para que, al integrar el backend, se borre
 * `lib/mock/dashboard/` sin tocar `interfaces/`.
 */
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";

/** Datos de dueño que el backend aún no tiene: estado y visitas de una publicación. */
export interface IMockOwnership {
  status: IDashboardPublicationStatus;
  visits30d: number;
}

/** Publicación real (`T`) con sus datos de dueño simulados. */
export interface IMockOwned<T> {
  item: T;
  ownership: IMockOwnership;
}
