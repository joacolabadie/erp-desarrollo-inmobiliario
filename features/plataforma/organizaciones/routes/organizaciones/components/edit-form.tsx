"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { editOrganizacionAction } from "@/features/plataforma/organizaciones/shared/actions";
import {
  editOrganizacionSchema,
  type EditOrganizacionSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type EditOrganizacionFormProps = {
  organizacionId: string;
  nombre: string;
};

export function EditOrganizacionForm({
  organizacionId,
  nombre,
}: EditOrganizacionFormProps) {
  const form = useForm<EditOrganizacionSchema>({
    resolver: zodResolver(editOrganizacionSchema),
    defaultValues: {
      organizacionId,
      nombre,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: EditOrganizacionSchema) {
    try {
      const response = await editOrganizacionAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al editar la organización.",
        );

        return;
      }

      toast.success("Organización editada correctamente.");
    } catch {
      toast.error("Ocurrió un error inesperado al editar la organización.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
            Guardar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
