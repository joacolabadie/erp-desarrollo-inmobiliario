import * as z from "zod";

export const organizacionCreateSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la organización.")
    .max(
      255,
      "El nombre de la organización no puede superar los 255 caracteres.",
    ),
});

export type OrganizacionCreateSchema = z.infer<typeof organizacionCreateSchema>;

export const organizacionEditSchema = z.object({
  organizacionId: z.uuid("La organización seleccionada es inválida."),
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la organización.")
    .max(
      255,
      "El nombre de la organización no puede superar los 255 caracteres.",
    ),
});

export type OrganizacionEditSchema = z.infer<typeof organizacionEditSchema>;
