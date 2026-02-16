import * as z from "zod";

export const crearOrganizacionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la organización.")
    .max(
      255,
      "El nombre de la organización no puede superar los 255 caracteres.",
    ),
});

export type CrearOrganizacionSchema = z.infer<typeof crearOrganizacionSchema>;
