"use client";

import { useEffect, useRef } from "react";
import { trackMetric } from "@/lib/metrics/track-metric";

interface LDCMetricViewProps {
  /** Id (uuid) del comercio o servicio cuya ficha se está viendo */
  listingId: string;
}

/**
 * LDCMetricView - Registro de la visita a una ficha
 *
 * Isla cliente sin DOM: al montar manda una vez el evento `view` del listing
 * a `/api/metrics` (`sendBeacon`, con `fetch` `keepalive` de respaldo). Si
 * cambia `listingId` (navegación cliente a otra ficha), manda el de la nueva.
 * Respeta Do Not Track y GPC.
 *
 * @example
 * ```tsx
 * <LDCMetricView listingId={listing.id} />
 * ```
 */
export function LDCMetricView({ listingId }: LDCMetricViewProps) {
  const sentFor = useRef<string | null>(null);

  useEffect(() => {
    if (sentFor.current === listingId) return;
    sentFor.current = listingId;
    trackMetric(listingId, "view");
  }, [listingId]);

  return null;
}
