import { z } from "zod";

/** «Tus datos» de `/dashboard/perfil`: el nombre, como lo valida `UpdateMeDto` (1 a 100, recortado). */
export const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, "Escribe tu nombre.").max(100, "Usa como máximo 100 caracteres."),
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
