import { APLICACION_SCOPE_VALUES } from "@/lib/domain";
import * as z from "zod";

export const moduloCreateSchema = z.object({
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

export type ModuloCreateSchema = z.infer<typeof moduloCreateSchema>;

export const moduloEditSchema = z.object({
  moduloId: z.uuid("El módulo seleccionado es inválido."),
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

export type ModuloEditSchema = z.infer<typeof moduloEditSchema>;

export const moduloDeleteSchema = z.object({
  moduloId: z.uuid("El módulo seleccionado es inválido."),
});

export type ModuloDeleteSchema = z.infer<typeof moduloDeleteSchema>;

export const aplicacionCreateSchema = z.object({
  moduloId: z.uuid("El módulo seleccionado es inválido."),
  clave: z
    .string()
    .trim()
    .min(1, "Ingresá la clave de la aplicación.")
    .max(255, "La clave de la aplicación no puede superar los 255 caracteres.")
    .regex(
      /^[A-Z_]+$/,
      "La clave de la aplicación solo puede contener letras mayúsculas y guiones bajos.",
    ),
  slug: z
    .string()
    .trim()
    .min(1, "Ingresá el slug de la aplicación.")
    .max(255, "El slug de la aplicación no puede superar los 255 caracteres.")
    .regex(
      /^[a-z-]+$/,
      "El slug de la aplicación solo puede contener letras minúsculas y guiones medios.",
    ),
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la aplicación.")
    .max(
      255,
      "El nombre de la aplicación no puede superar los 255 caracteres.",
    ),
  scope: z
    .string()
    .trim()
    .min(1, "Seleccioná un scope para la aplicación.")
    .refine(
      (value) => (APLICACION_SCOPE_VALUES as readonly string[]).includes(value),
      "Seleccioná un scope para la aplicación.",
    ),
});

export type AplicacionCreateSchema = z.infer<typeof aplicacionCreateSchema>;

export const aplicacionEditSchema = z.object({
  moduloId: z.uuid("El módulo seleccionado es inválido."),
  aplicacionId: z.uuid("La aplicación seleccionada es inválida."),
  clave: z
    .string()
    .trim()
    .min(1, "Ingresá la clave de la aplicación.")
    .max(255, "La clave de la aplicación no puede superar los 255 caracteres.")
    .regex(
      /^[A-Z_]+$/,
      "La clave de la aplicación solo puede contener letras mayúsculas y guiones bajos.",
    ),
  slug: z
    .string()
    .trim()
    .min(1, "Ingresá el slug de la aplicación.")
    .max(255, "El slug de la aplicación no puede superar los 255 caracteres.")
    .regex(
      /^[a-z-]+$/,
      "El slug de la aplicación solo puede contener letras minúsculas y guiones medios.",
    ),
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la aplicación.")
    .max(
      255,
      "El nombre de la aplicación no puede superar los 255 caracteres.",
    ),
  scope: z
    .string()
    .trim()
    .min(1, "Seleccioná un scope para la aplicación.")
    .refine(
      (value) => (APLICACION_SCOPE_VALUES as readonly string[]).includes(value),
      "Seleccioná un scope para la aplicación.",
    ),
});

export type AplicacionEditSchema = z.infer<typeof aplicacionEditSchema>;

export const aplicacionDeleteSchema = z.object({
  aplicacionId: z.uuid("La aplicación seleccionada es inválida."),
});

export type AplicacionDeleteSchema = z.infer<typeof aplicacionDeleteSchema>;
