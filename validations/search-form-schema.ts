import { z } from "zod";

/**
 * Buscador del hero: basta con un campo (el botón se deshabilita si los tres están vacíos).
 * El término, si se escribe, pide 3 caracteres; categoría y ciudad son slugs opcionales.
 */
export const searchFormSchema = z.object({
  searchTerm: z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= 3, {
      message: "Se requiere un mínimo de 3 caracteres",
    }),
  searchCategory: z.string(),
  searchCity: z.string(),
});
