import { z } from "zod";

/**
 * «Tus datos» de `/dashboard/perfil`: el nombre, como lo validan `UpdateMeDto` y el registro (2 a
 * 80, recortado; CLGDC-132).
 */
export const profileDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre: al menos 2 caracteres.")
    .max(80, "Usa como máximo 80 caracteres."),
});

export type LDCProfileDetailsValues = z.infer<typeof profileDetailsSchema>;

/**
 * «Contraseña» de `/dashboard/perfil`, como `ChangePasswordDto` (la nueva, 8 a 128). La
 * confirmación es solo del front. Que la nueva sea distinta de la actual lo dice el backend.
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Escribe tu contraseña actual.")
      .max(128, "Usa como máximo 128 caracteres."),
    newPassword: z
      .string()
      .min(8, "Usa al menos 8 caracteres.")
      .max(128, "Usa como máximo 128 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((v) => v.confirmPassword === v.newPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type LDCPasswordChangeValues = z.infer<typeof passwordChangeSchema>;

/** Lo que valida la server action (sin la confirmación). */
export const passwordChangeInputSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
});
