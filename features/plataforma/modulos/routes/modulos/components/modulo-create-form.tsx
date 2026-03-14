"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { moduloCreateAction } from "@/features/plataforma/modulos/shared/actions";
import {
  moduloCreateSchema,
  type ModuloCreateSchema,
} from "@/features/plataforma/modulos/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function ModuloCreateForm() {
  const router = useRouter();

  const form = useForm<ModuloCreateSchema>({
    resolver: zodResolver(moduloCreateSchema),
    defaultValues: {
      clave: "",
      slug: "",
      nombre: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ModuloCreateSchema) {
    try {
      const response = await moduloCreateAction(data);

      if (!response.ok) {
        toast.error(
          response.message || "Ocurrió un error inesperado al crear el módulo.",
        );

        return;
      }

      toast.success("Módulo creado correctamente.");

      form.reset();

      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado al crear el módulo.");
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
            Crear
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
