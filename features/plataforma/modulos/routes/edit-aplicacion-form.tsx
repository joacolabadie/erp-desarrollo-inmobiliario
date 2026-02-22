"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editAplicacionAction } from "@/features/plataforma/modulos/routes/actions";
import {
  editAplicacionSchema,
  type EditAplicacionSchema,
} from "@/features/plataforma/modulos/routes/schema";
import {
  APLICACION_SCOPE_LABELS,
  APLICACION_SCOPE_VALUES,
} from "@/lib/domain/aplicaciones/scope";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type EditAplicacionFormProps = {
  moduloId: string;
  aplicacionId: string;
  clave: string;
  slug: string;
  nombre: string;
  scope: string;
};

export function EditAplicacionForm({
  moduloId,
  aplicacionId,
  clave,
  slug,
  nombre,
  scope,
}: EditAplicacionFormProps) {
  const form = useForm<EditAplicacionSchema>({
    resolver: zodResolver(editAplicacionSchema),
    defaultValues: {
      moduloId,
      aplicacionId,
      clave,
      slug,
      nombre,
      scope,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: EditAplicacionSchema) {
    try {
      const response = await editAplicacionAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al editar la aplicación.",
        );

        return;
      }

      toast.success("Aplicación editada correctamente.");
    } catch {
      toast.error("Ocurrió un error inesperado al editar la aplicación.");
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
        <Controller
          name="scope"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Scope</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Seleccioná un scope" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {APLICACION_SCOPE_VALUES.map((scope) => (
                      <SelectItem key={scope} value={scope}>
                        {APLICACION_SCOPE_LABELS[scope]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Guardar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
