"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Ingresá tu nombre completo.")
      .max(255, "Tu nombre completo no puede superar los 255 caracteres."),
    email: z
      .email("Ingresá un correo electrónico válido.")
      .min(1, "Ingresá tu correo electrónico.")
      .max(255, "Tu correo electrónico no puede superar los 255 caracteres."),
    password: z
      .string()
      .min(8, "Tu contraseña debe tener al menos 8 caracteres.")
      .max(128, "Tu contraseña no puede superar los 128 caracteres."),
    confirmPassword: z
      .string()
      .min(8, "Volvé a ingresar tu contraseña.")
      .max(
        128,
        "La confirmación de la contraseña no puede superar los 128 caracteres.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const res = await authClient.signUp.email({
          name: data.fullName,
          email: data.email,
          password: data.password,
        });

        if (res.error) {
          toast.error("Ocurrió un error inesperado al registrarte.");

          return;
        }

        router.push("/dashboard");
      } catch {
        toast.error("Ocurrió un error inesperado al registrarte.");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre completo</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Nombre completo"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirmar contraseña</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button size="sm" type="submit" disabled={isPending}>
            Registrarme
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
