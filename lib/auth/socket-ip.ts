import "server-only";
import http, { type IncomingMessage } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

/**
 * IP del socket del cliente para reenviarla al backend en `X-Forwarded-For`.
 *
 * Next no la expone en los Route Handlers (`request.ip` ya no existe) y su propio
 * `x-forwarded-for` solo pone la del socket si el cliente no mandó la cabecera: si la mandó, la
 * deja tal cual, así que copiarla permitiría falsear la IP. Por eso `instrumentation.ts`
 * instala, una vez por proceso, un gancho en `http.Server` que en cada petición borra
 * `x-lgdc-socket-ip` y la vuelve a escribir como `<marca>:<ip del socket>`, donde la marca es un
 * secreto aleatorio del proceso.
 *
 * Falla cerrado: `getSocketIp` solo confía en una petición que trae la marca, es decir, que pasó
 * por el gancho. Con HTTPS, un servidor propio o sin gancho, el cliente no puede conocer la marca
 * y no se reenvía nada: el backend ve entonces la IP del contenedor del front.
 */
const SOCKET_IP_HEADER = "x-lgdc-socket-ip";
const MARK_KEY = Symbol.for("lgdc.socketIpMark");

type Marked = typeof globalThis & { [MARK_KEY]?: string };

/** Instala el gancho en `http.Server.prototype.emit`. Idempotente. */
export function installSocketIpCapture(): void {
  const g = globalThis as Marked;
  if (g[MARK_KEY]) return;
  const mark = randomBytes(24).toString("hex");
  const proto = http.Server.prototype;
  const originalEmit = proto.emit;
  proto.emit = function emit(this: unknown, event: string | symbol, ...args: unknown[]) {
    if (event === "request") {
      const req = args[0] as IncomingMessage;
      delete req.headers[SOCKET_IP_HEADER];
      const ip = req.socket?.remoteAddress;
      if (ip) req.headers[SOCKET_IP_HEADER] = `${mark}:${ip}`;
    }
    return Reflect.apply(originalEmit, this, [event, ...args]) as boolean;
  } as typeof proto.emit;
  g[MARK_KEY] = mark;
}

/** IP del socket de esta petición, o `null` si no la marcó el gancho o el valor no es una IP. */
export function getSocketIp(headers: Headers): string | null {
  const mark = (globalThis as Marked)[MARK_KEY];
  const value = headers.get(SOCKET_IP_HEADER);
  if (!mark || !value) return null;
  const sep = value.indexOf(":");
  if (sep !== mark.length) return null;
  const given = Buffer.from(value.slice(0, sep));
  if (!timingSafeEqual(given, Buffer.from(mark))) return null;
  const ip = value.slice(sep + 1).trim();
  return isIP(ip) ? ip : null;
}

/** Cabecera `X-Forwarded-For` con la IP del socket, o vacía si no se conoce. */
export function forwardedForHeader(request: Request): Record<string, string> {
  const ip = getSocketIp(request.headers);
  return ip ? { "X-Forwarded-For": ip } : {};
}
