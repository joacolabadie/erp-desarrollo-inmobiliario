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
import { aplicacionEditAction } from "@/features/plataforma/modulos/shared/actions";
import {
  aplicacionEditSchema,
  type AplicacionEditSchema,
} from "@/features/plataforma/modulos/shared/schema";
import type { Aplicacion } from "@/features/plataforma/modulos/shared/types";
import { APLICACION_SCOPE_LABELS, APLICACION_SCOPE_VALUES } from "@/lib/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type AplicacionEditFormProps = {
  moduloId: string;
  aplicacion: Aplicacion;
};

export function AplicacionEditForm({
  moduloId,
  aplicacion,
}: AplicacionEditFormProps) {
  const router = useRouter();

  const form = useForm<AplicacionEditSchema>({
    resolver: zodResolver(aplicacionEditSchema),
    defaultValues: {
      moduloId,
      aplicacionId: aplicacion.id,
      clave: aplicacion.clave,
      slug: aplicacion.slug,
      nombre: aplicacion.nombre,
      scope: aplicacion.scope,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: AplicacionEditSchema) {
    try {
      const response = await aplicacionEditAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al editar la aplicación.",
        );

        return;
      }

      toast.success("Aplicación editada correctamente.");

      router.refresh();
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
