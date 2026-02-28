"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { organizacionEditAction } from "@/features/plataforma/organizaciones/shared/actions";
import {
  organizacionEditSchema,
  type OrganizacionEditSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type OrganizacionEditFormProps = {
  organizacionId: string;
  nombre: string;
};

export function OrganizacionEditForm({
  organizacionId,
  nombre,
}: OrganizacionEditFormProps) {
  const form = useForm<OrganizacionEditSchema>({
    resolver: zodResolver(organizacionEditSchema),
    defaultValues: {
      organizacionId,
      nombre,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: OrganizacionEditSchema) {
    try {
      const response = await organizacionEditAction(data);

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
