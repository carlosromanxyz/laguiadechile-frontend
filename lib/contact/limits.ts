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
 * Asuntos que `/contacto` acepta por `?asunto=<clave>` (CLGDC-206). Lista cerrada: la URL nunca
 * pone texto libre en el formulario, así nadie arma un enlace con un asunto engañoso. Para sumar
 * uno, agrega su clave aquí (cada asunto cabe en `CONTACT_LIMITS.subject`).
 */
export const CONTACT_SUBJECT_PRESETS = {
  /** Tile «Sugerir» de `LDCPublishChooser` */
  sugerir: "Sugerir un lugar",
} as const satisfies Record<string, string>;

/**
 * Asunto inicial del formulario a partir de `?asunto=`: el de `CONTACT_SUBJECT_PRESETS` si el valor
 * es una de sus claves; cualquier otra cosa (texto libre, clave desconocida, parámetro repetido)
 * da `""`. Es el único campo que se prellena por URL.
 */
export function contactSubjectFromPreset(value: unknown): string {
  if (typeof value !== "string" || !Object.hasOwn(CONTACT_SUBJECT_PRESETS, value)) return "";
  return CONTACT_SUBJECT_PRESETS[value as keyof typeof CONTACT_SUBJECT_PRESETS];
}
