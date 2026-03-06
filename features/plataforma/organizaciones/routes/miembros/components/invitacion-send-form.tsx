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
import {
  invitacionSendSchema,
  type InvitacionSendSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import {
  MIEMBRO_ORGANIZACION_ROL_LABELS,
  MIEMBRO_ORGANIZACION_ROL_VALUES,
} from "@/lib/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type InvitacionSendFormProps = {
  organizacionId: string;
  onSuccess?: () => void;
};

export function InvitacionSendForm({
  organizacionId,
  onSuccess,
}: InvitacionSendFormProps) {
  const router = useRouter();

  const form = useForm<InvitacionSendSchema>({
    resolver: zodResolver(invitacionSendSchema),
    defaultValues: {
      email: "",
      rol: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: InvitacionSendSchema) {
    try {
      const response = await fetch(
        `/api/organizacion/${organizacionId}/invitaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        toast.error(
          result.message ||
            "Ocurrió un error inesperado al enviar la invitación.",
        );

        return;
      }

      toast.success("Invitación enviada correctamente.");

      form.reset();

      onSuccess?.();

      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado al enviar la invitación.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="rol"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Rol</FieldLabel>
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
                  <SelectValue placeholder="Seleccioná un rol" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {MIEMBRO_ORGANIZACION_ROL_VALUES.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {MIEMBRO_ORGANIZACION_ROL_LABELS[rol]}
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
            Enviar invitación
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
