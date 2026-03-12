import { MIEMBRO_ORGANIZACION_ROL_VALUES } from "@/lib/domain";
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

export const modulosConfigureSchema = z.object({
  organizacionId: z.uuid("La organización seleccionada es inválida."),
  aplicacionIds: z.array(z.uuid()),
});

export type ModulosConfigureSchema = z.infer<typeof modulosConfigureSchema>;

export const invitacionSendSchema = z.object({
  email: z.email("Ingresá un email válido.").trim().toLowerCase(),
  rol: z
    .string()
    .trim()
    .min(1, "Seleccioná un rol para la invitación.")
    .refine(
      (value) =>
        (MIEMBRO_ORGANIZACION_ROL_VALUES as readonly string[]).includes(value),
      "Seleccioná un rol para la invitación.",
    ),
});

export type InvitacionSendSchema = z.infer<typeof invitacionSendSchema>;
