/** Tipo de evento de métricas de una ficha de comercio o servicio. */
export type IMetricKind = "view" | "whatsapp" | "call" | "web";

/** Cuerpo de `POST /api/metrics` (y de `POST /metrics/events` del backend). */
export interface IMetricEvent {
  listingId: string;
  kind: IMetricKind;
}
