"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createOrganizacionAction } from "@/features/plataforma/organizaciones/shared/actions";
import {
  createOrganizacionSchema,
  type CreateOrganizacionSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateOrganizacionForm() {
  const router = useRouter();

  const form = useForm<CreateOrganizacionSchema>({
    resolver: zodResolver(createOrganizacionSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: CreateOrganizacionSchema) {
    try {
      const response = await createOrganizacionAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al crear la organización.",
        );

        return;
      }

      toast.success("Organización creada correctamente.");

      form.reset();

      router.push("/dashboard/plataforma/organizaciones");
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
