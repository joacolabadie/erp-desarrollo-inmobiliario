"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { modulosConfigureAction } from "@/features/plataforma/organizaciones/shared/actions";
import {
  modulosConfigureSchema,
  type ModulosConfigureSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import type {
  Aplicacion,
  Modulo,
} from "@/features/plataforma/organizaciones/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Fragment, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ModulosConfigureFormProps = {
  organizacionId: string;
  modulos: (Modulo & { aplicaciones: Aplicacion[] })[];
  enabledAplicacionIds: string[];
};

export function ModulosConfigureForm({
  organizacionId,
  modulos,
  enabledAplicacionIds,
}: ModulosConfigureFormProps) {
  const allAplicaciones = useMemo(
    () =>
      modulos.flatMap((modulo) =>
        modulo.aplicaciones.map((aplicacion) => aplicacion.id),
      ),
    [modulos],
  );

  const initialSelected = useMemo(
    () => enabledAplicacionIds.filter((id) => allAplicaciones.includes(id)),
    [enabledAplicacionIds, allAplicaciones],
  );

  const form = useForm<ModulosConfigureSchema>({
    resolver: zodResolver(modulosConfigureSchema),
    defaultValues: {
      organizacionId,
      aplicacionIds: initialSelected,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ModulosConfigureSchema) {
    try {
      const response = await modulosConfigureAction(data);

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al configurar los módulos de la organización.",
        );

        return;
      }

      toast.success("Módulos de la organización configurados correctamente.");
    } catch {
      toast.error(
        "Ocurrió un error inesperado al configurar los módulos de la organización.",
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="aplicacionIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldGroup>
              {modulos.map((modulo, idx) => (
                <Fragment key={modulo.id}>
                  {idx > 0 && <FieldSeparator />}
                  <div>
                    <FieldSet data-invalid={fieldState.invalid}>
                      <FieldLegend variant="label">{modulo.nombre}</FieldLegend>
                      <FieldGroup data-slot="checkbox-group">
                        {modulo.aplicaciones.map((aplicacion) => (
                          <Field
                            key={aplicacion.id}
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <Checkbox
                              id={`modulos-configure-${modulo.id}-${aplicacion.id}`}
                              name={field.name}
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                              checked={field.value.includes(aplicacion.id)}
                              onCheckedChange={(checked) => {
                                const next = checked
                                  ? [...field.value, aplicacion.id]
                                  : field.value.filter(
                                      (v) => v !== aplicacion.id,
                                    );
                                field.onChange(next);
                              }}
                            />
                            <FieldLabel
                              htmlFor={`modulos-configure-${modulo.id}-${aplicacion.id}`}
                              className="font-normal"
                            >
                              {aplicacion.nombre}
                            </FieldLabel>
                          </Field>
                        ))}
                      </FieldGroup>
                    </FieldSet>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Fragment>
              ))}
            </FieldGroup>
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
