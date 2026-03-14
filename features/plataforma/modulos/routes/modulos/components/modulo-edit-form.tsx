"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { moduloEditAction } from "@/features/plataforma/modulos/shared/actions";
import {
  moduloEditSchema,
  type ModuloEditSchema,
} from "@/features/plataforma/modulos/shared/schema";
import type { Modulo } from "@/features/plataforma/modulos/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ModuloEditFormProps = {
  modulo: Modulo;
};

export function ModuloEditForm({ modulo }: ModuloEditFormProps) {
  const router = useRouter();

  const form = useForm<ModuloEditSchema>({
    resolver: zodResolver(moduloEditSchema),
    defaultValues: {
      moduloId: modulo.id,
      clave: modulo.clave,
      slug: modulo.slug,
      nombre: modulo.nombre,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ModuloEditSchema) {
    try {
      const response = await moduloEditAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al editar el módulo.",
        );

        return;
      }

      toast.success("Módulo editado correctamente.");

      router.refresh();
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
            {isSubmitting && (
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2}
                className="animate-spin"
              />
            )}
            Guardar cambios
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
