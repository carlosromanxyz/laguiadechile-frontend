"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/** Cada cuánto se vuelve a mirar la hora (ms). */
const TICK_MS = 30_000;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, TICK_MS);
  return () => clearInterval(timer);
}

export interface LDCTimeSwitchProps {
  /** Instante (ISO) en que se pasa de `before` a `after` */
  at: string;
  /** Si ya había pasado cuando el servidor renderizó (lo que se pinta antes de hidratar) */
  serverPassed: boolean;
  /** Lo que se muestra mientras `at` no llega */
  before?: ReactNode;
  /** Lo que se muestra desde `at` */
  after?: ReactNode;
}

/**
 * LDCTimeSwitch - Muestra `before` o `after` según la hora del navegador
 *
 * Isla cliente sin DOM propio: en el servidor (y al hidratar) usa `serverPassed`; ya en el
 * navegador compara `at` con la hora actual y la vuelve a mirar cada 30 s. Así algo que depende
 * de la hora (p. ej. «Terminado» o el botón de compra de un evento) no queda atado a la caché ISR
 * de la página.
 *
 * @example
 * <LDCTimeSwitch at={endsAt} serverPassed={past} after={<LDCBadge variant="status-expired">Terminado</LDCBadge>} />
 */
export function LDCTimeSwitch({ at, serverPassed, before = null, after = null }: LDCTimeSwitchProps) {
  const end = new Date(at).getTime();
  const passed = useSyncExternalStore(
    subscribe,
    () => Date.now() >= end,
    () => serverPassed,
  );
  return <>{passed ? after : before}</>;
}
