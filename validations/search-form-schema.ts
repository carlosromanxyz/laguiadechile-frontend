import { z } from "zod";

export const searchFormSchema = z.object({
  searchTerm: z
    .string()
    .min(3, {
      message: "Se requiere un mínimo de 3 caracteres",
    }),
  searchCategory: z
    .string()
    .min(3, {
      message: "Se requiere un mínimo de 3 caracteres",
    }),
  searchCity: z
    .string()
    .min(3, {
      message: "Se requiere un mínimo de 3 caracteres",
    }),
});
