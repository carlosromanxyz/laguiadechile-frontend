/**
 * Topes del formulario de contacto: los mismos de `CreateContactMessageDto` del backend (CLGDC-119).
 * Helpers puros, seguros en server y client.
 */
export const CONTACT_LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 5000,
} as const;

/**
 * Correo con forma `algo@dominio.tld`, sin espacios, comillas ni `? & = % # /`: esos caracteres
 * podrían agregar parámetros (`?body=`, `&cc=`) al `mailto:` de «Responder». Mismo criterio que
 * `SAFE_EMAIL` del backend, que además valida con `IsEmail` (y responde 400 si no pasa).
 */
const EMAIL = /^[^\s"@?&=%#/]+@[^\s"@?&=%#/]+\.[^\s"@?&=%#/]+$/;

export function isValidContactEmail(email: string): boolean {
  return email.length <= CONTACT_LIMITS.email && EMAIL.test(email);
}

/**
 * Asunto inicial del formulario a partir de `?asunto=` de `/contacto` (CLGDC-206): solo un string
 * (un parámetro repetido no cuenta), en una línea (los saltos y demás caracteres de control pasan a
 * un espacio), sin espacios en los bordes y recortado a `CONTACT_LIMITS.subject`. Cualquier otro
 * valor da `""`. Es el único campo que se prellena por URL, así nadie arma un enlace con el
 * mensaje o el remitente ya puestos.
 */
export function toContactSubject(value: unknown): string {
  if (typeof value !== "string") return "";
  let subject = value.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").trim();
  if (subject.length > CONTACT_LIMITS.subject) {
    subject = subject.slice(0, CONTACT_LIMITS.subject);
    // Sin media pareja suelta si el corte cayó dentro de un emoji.
    if (/[\ud800-\udbff]$/.test(subject)) subject = subject.slice(0, -1);
    subject = subject.trimEnd();
  }
  return subject;
}
