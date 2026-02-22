"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { editModuloAction } from "@/features/plataforma/modulos/routes/actions";
import {
  editModuloSchema,
  type EditModuloSchema,
} from "@/features/plataforma/modulos/routes/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type EditModuloFormProps = {
  moduloId: string;
  clave: string;
  slug: string;
  nombre: string;
};

export function EditModuloForm({
  moduloId,
  clave,
  slug,
  nombre,
}: EditModuloFormProps) {
  const form = useForm<EditModuloSchema>({
    resolver: zodResolver(editModuloSchema),
    defaultValues: {
      moduloId,
      clave,
      slug,
      nombre,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: EditModuloSchema) {
    try {
      const response = await editModuloAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al editar el módulo.",
        );

        return;
      }

      toast.success("Módulo editado correctamente.");
    } catch {
      toast.error("Ocurrió un error inesperado al editar el módulo.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="clave"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Clave</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="nombre"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Guardar cambios
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
