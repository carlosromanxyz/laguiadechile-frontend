import { z } from "zod";
import {
  CURRENT_PASSWORD_MAX_LENGTH,
  fitsPasswordBytes,
  PASSWORD_MAX_BYTES_MESSAGE,
} from "@/validations/password-bytes";

/** «Tus datos» de `/dashboard/perfil`: el nombre, como lo valida `UpdateMeDto` (1 a 100, recortado). */
export const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, "Escribe tu nombre.").max(100, "Usa como máximo 100 caracteres."),
});

export type LDCProfileDetailsValues = z.infer<typeof profileDetailsSchema>;

/**
 * «Contraseña» de `/dashboard/perfil`, como `ChangePasswordDto`: la nueva, de 8 caracteres a 72
 * bytes UTF-8 (límite de bcrypt, CLGDC-131); la actual no se limita a 72 bytes (una clave antigua
 * más larga debe poder escribirse), solo a 256 caracteres. La confirmación es solo del front. Que
 * la nueva sea distinta de la actual lo dice el backend.
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Escribe tu contraseña actual.")
      .max(CURRENT_PASSWORD_MAX_LENGTH, "Usa como máximo 256 caracteres."),
    newPassword: z
      .string()
      .min(8, "Usa al menos 8 caracteres.")
      .refine(fitsPasswordBytes, PASSWORD_MAX_BYTES_MESSAGE),
    confirmPassword: z.string(),
  })
  .refine((v) => v.confirmPassword === v.newPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type LDCPasswordChangeValues = z.infer<typeof passwordChangeSchema>;

/** Lo que valida la server action (sin la confirmación). */
export const passwordChangeInputSchema = z.object({
  currentPassword: z.string().min(1).max(CURRENT_PASSWORD_MAX_LENGTH),
  newPassword: z.string().min(8).refine(fitsPasswordBytes),
});
