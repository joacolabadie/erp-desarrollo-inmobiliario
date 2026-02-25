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
import { createAplicacionAction } from "@/features/plataforma/modulos/routes/actions";
import {
  createAplicacionSchema,
  type CreateAplicacionSchema,
} from "@/features/plataforma/modulos/routes/schema";
import {
  APLICACION_SCOPE_LABELS,
  APLICACION_SCOPE_VALUES,
} from "@/lib/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateAplicacionFormProps = {
  moduloId: string;
};

export function CreateAplicacionForm({ moduloId }: CreateAplicacionFormProps) {
  const router = useRouter();

  const form = useForm<CreateAplicacionSchema>({
    resolver: zodResolver(createAplicacionSchema),
    defaultValues: {
      moduloId,
      clave: "",
      slug: "",
      nombre: "",
      scope: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: CreateAplicacionSchema) {
    try {
      const response = await createAplicacionAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al crear la aplicación.",
        );

        return;
      }

      toast.success("Aplicación creada correctamente.");

      form.reset();

      router.push(`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`);
    } catch {
      toast.error("Ocurrió un error inesperado al crear la aplicación.");
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
            Crear
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
