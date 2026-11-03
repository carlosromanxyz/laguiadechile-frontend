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
