import { APLICACION_SCOPE_VALUES } from "@/lib/domain";
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
    .trim()
    .min(1, "Seleccioná un scope para la aplicación.")
    .refine(
      (value) => (APLICACION_SCOPE_VALUES as readonly string[]).includes(value),
      "Seleccioná un scope para la aplicación.",
    ),
});

export type CreateAplicacionSchema = z.infer<typeof createAplicacionSchema>;

export const editAplicacionSchema = z.object({
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

export type EditAplicacionSchema = z.infer<typeof editAplicacionSchema>;
