import { z } from "zod";

/**
 * Nombre y apellido de una cuenta (CLGDC-194), como los validan `RegisterDto` y `UpdateMeDto`: 2 a
 * 80 caracteres cada uno, recortados. Lo usan el registro (`LDCRegisterForm`) y «Tus datos» del
 * perfil (`profileDetailsSchema`).
 *
 * El error dice qué corregir (WCAG 3.3.3): vacío, «Escribe tu nombre» / «Escribe tu apellido»; de
 * 1 carácter, «Usa al menos 2 caracteres». Con el campo vacío fallan los dos `min`, y el
 * formulario y la server action muestran solo el primero.
 */
const nameField = (emptyMessage: string) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .min(2, "Usa al menos 2 caracteres")
    .max(80, "Máximo 80 caracteres");

export const personNameSchema = z.object({
  firstName: nameField("Escribe tu nombre"),
  lastName: nameField("Escribe tu apellido"),
});

export type LDCPersonNameValues = z.infer<typeof personNameSchema>;
