/**
 * Límite de las contraseñas nuevas (CLGDC-131): bcrypt solo usa los primeros 72 bytes en UTF-8,
 * así que el registro y la contraseña nueva de `/dashboard/perfil` no aceptan más. Se mide en
 * bytes, no en caracteres: una letra con tilde o la ñ ocupan 2. Sirve en el cliente y en el
 * servidor (`TextEncoder`, como `Buffer.byteLength` del backend).
 */
export const PASSWORD_MAX_BYTES = 72;

export const PASSWORD_MAX_BYTES_MESSAGE =
  "Usa como máximo 72 caracteres; cada letra con tilde o ñ cuenta como 2.";

/**
 * Tope amplio para las claves que ya existen (login y contraseña actual): no se limitan a 72 bytes
 * para no dejar fuera una cuenta creada antes del límite.
 */
export const CURRENT_PASSWORD_MAX_LENGTH = 256;

const encoder = new TextEncoder();

/** `true` si la contraseña cabe en 72 bytes UTF-8. */
export function fitsPasswordBytes(value: string): boolean {
  return encoder.encode(value).length <= PASSWORD_MAX_BYTES;
}
