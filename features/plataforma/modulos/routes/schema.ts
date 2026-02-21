import {
  APLICACION_SCOPE_VALUES,
  AplicacionScope,
} from "@/lib/domain/aplicaciones/scope";
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

export const editModuloSchema = z.object({
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

export type EditModuloSchema = z.infer<typeof editModuloSchema>;

export const createAplicacionSchema = z.object({
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
    .min(1, "Seleccioná el scope de la aplicación.")
    .refine(
      (value) => (APLICACION_SCOPE_VALUES as readonly string[]).includes(value),
      "Seleccioná el scope de la aplicación.",
    )
    .transform((value) => value as AplicacionScope),
});

export type CreateAplicacionSchema = z.infer<typeof createAplicacionSchema>;
