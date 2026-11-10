/**
 * Cliente mínimo de la API de Mailpit para la suite e2e (CLGDC-196).
 *
 * Dentro de la red del front, Mailpit responde en `http://mailpit:8025` (`MAILPIT_URL` lo cambia).
 * API: https://mailpit.axllent.org/docs/api-v1/
 */

const MAILPIT_URL = (process.env.MAILPIT_URL ?? "http://mailpit:8025").replace(/\/$/, "");

export interface MailpitAddress {
  Name: string;
  Address: string;
}

/** Lo que usa la suite de `GET /api/v1/message/{ID}`. */
export interface MailpitMessage {
  ID: string;
  From: MailpitAddress;
  To: MailpitAddress[];
  Subject: string;
  Text: string;
}

interface MailpitSearch {
  messages_count: number;
  messages: { ID: string }[];
}

const searchQuery = (email: string) => encodeURIComponent(`to:"${email}"`);

async function mailpit(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${MAILPIT_URL}${path}`, init);
  if (!res.ok) throw new Error(`Mailpit ${init?.method ?? "GET"} ${path}: HTTP ${res.status}`);
  return res;
}

/** Cuántos mensajes hay para ese destinatario (sin esperar). */
export async function countMessagesTo(email: string): Promise<number> {
  const res = await mailpit(`/api/v1/search?query=${searchQuery(email)}`);
  const data = (await res.json()) as MailpitSearch;
  return data.messages_count;
}

/**
 * Espera el primer mensaje para `email` (consulta cada 500 ms) y devuelve el mensaje completo.
 * Falla con un error claro si no llega dentro de `timeout` ms.
 */
export async function waitForMessageTo(
  email: string,
  { timeout = 15_000 }: { timeout?: number } = {},
): Promise<MailpitMessage> {
  const limit = Date.now() + timeout;
  while (Date.now() < limit) {
    const res = await mailpit(`/api/v1/search?query=${searchQuery(email)}`);
    const data = (await res.json()) as MailpitSearch;
    const first = data.messages[0];
    if (first) {
      const message = await mailpit(`/api/v1/message/${encodeURIComponent(first.ID)}`);
      return (await message.json()) as MailpitMessage;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Mailpit: no llegó ningún mensaje para ${email} en ${timeout} ms`);
}

/** Borra todos los mensajes para ese destinatario. */
export async function deleteMessagesTo(email: string): Promise<void> {
  await mailpit(`/api/v1/search?query=${searchQuery(email)}`, { method: "DELETE" });
}
