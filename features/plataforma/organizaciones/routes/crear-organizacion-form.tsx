"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { crearOrganizacionAction } from "@/features/plataforma/organizaciones/routes/actions";
import {
  crearOrganizacionSchema,
  type CrearOrganizacionSchema,
} from "@/features/plataforma/organizaciones/routes/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CrearOrganizacionForm() {
  const form = useForm<CrearOrganizacionSchema>({
    resolver: zodResolver(crearOrganizacionSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: CrearOrganizacionSchema) {
    try {
      const response = await crearOrganizacionAction({
        nombre: data.nombre,
      });

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al crear la organización.",
        );

        return;
      }

      toast.success("Organización creada correctamente.");

      form.reset();
    } catch {
      toast.error("Ocurrió un error inesperado al crear la organización.");
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
            Crear
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
