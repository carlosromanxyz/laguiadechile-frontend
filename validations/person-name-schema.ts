import { z } from "zod";

/**
 * Nombre y apellido de una cuenta (CLGDC-194), como los validan `RegisterDto` y `UpdateMeDto`: 2 a
 * 80 caracteres cada uno, recortados. Lo usan el registro (`LDCRegisterForm`) y «Tus datos» del
 * perfil (`profileDetailsSchema`).
 *
 * Solo letras Unicode (con acentos), separadas por un espacio, guion o apóstrofo (' o ’), sin
 * separador al inicio ni al final (CLGDC-196): el nombre va en el correo de bienvenida y así no
 * cabe un enlace ni otro texto ajeno. Es la misma regex que valida el backend. Antes de validar,
 * los espacios seguidos (o tabs) se colapsan en uno y se recorta, así «Ana  María» se acepta y se
 * envía como «Ana María».
 *
 * El error dice qué corregir (WCAG 3.3.3): vacío, «Escribe tu nombre» / «Escribe tu apellido»; de
 * 1 carácter, «Usa al menos 2 caracteres»; con otros caracteres, «Usa solo letras, espacios,
 * guion o apóstrofo». Con el campo vacío fallan los dos `min` y la regex, y el formulario y la
 * server action muestran solo el primero.
 */
const PERSON_NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u;

const nameField = (emptyMessage: string) =>
  z
    .string()
    .overwrite((value) => value.replace(/\s+/g, " "))
    .trim()
    .min(1, emptyMessage)
    .min(2, "Usa al menos 2 caracteres")
    .max(80, "Máximo 80 caracteres")
    .regex(PERSON_NAME_PATTERN, "Usa solo letras, espacios, guion o apóstrofo");

export const personNameSchema = z.object({
  firstName: nameField("Escribe tu nombre"),
  lastName: nameField("Escribe tu apellido"),
});

export type LDCPersonNameValues = z.infer<typeof personNameSchema>;
