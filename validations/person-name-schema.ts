import { z } from "zod";

/**
 * Nombre y apellido de una cuenta (CLGDC-194), como los validan `RegisterDto` y `UpdateMeDto`: 2 a
 * 80 caracteres cada uno, recortados. Lo usan el registro (`LDCRegisterForm`) y «Tus datos» del
 * perfil (`profileDetailsSchema`).
 */
export const personNameSchema = z.object({
  firstName: z.string().trim().min(2, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
  lastName: z.string().trim().min(2, "Escribe tu apellido").max(80, "Máximo 80 caracteres"),
});

export type LDCPersonNameValues = z.infer<typeof personNameSchema>;
