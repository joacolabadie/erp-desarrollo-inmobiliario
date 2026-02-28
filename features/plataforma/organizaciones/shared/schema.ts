import * as z from "zod";

export const createOrganizacionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la organización.")
    .max(
      255,
      "El nombre de la organización no puede superar los 255 caracteres.",
    ),
});

export type CreateOrganizacionSchema = z.infer<typeof createOrganizacionSchema>;

export const editOrganizacionSchema = z.object({
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

export type EditOrganizacionSchema = z.infer<typeof editOrganizacionSchema>;
