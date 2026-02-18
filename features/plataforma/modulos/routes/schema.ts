import * as z from "zod";

export const createModuloSchema = z.object({
  clave: z
    .string()
    .trim()
    .min(1, "Ingresá la clave del módulo.")
    .max(255, "La clave del módulo no puede superar los 255 caracteres.")
    .regex(
      /^[A-Z_]+$/,
      "La clave del módulo solo puede contener letras mayúsculas y guiones bajos.",
    ),
  slug: z
    .string()
    .trim()
    .min(1, "Ingresá el slug del módulo.")
    .max(255, "El slug del módulo no puede superar los 255 caracteres.")
    .regex(
      /^[a-z-]+$/,
      "El slug del módulo solo puede contener letras minúsculas y guiones medios.",
    ),
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre del módulo.")
    .max(255, "El nombre del módulo no puede superar los 255 caracteres."),
});

export type CreateModuloSchema = z.infer<typeof createModuloSchema>;
