"use server";

import {
  createOrganizacionSchema,
  editOrganizacionSchema,
  type CreateOrganizacionSchema,
  type EditOrganizacionSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones as organizacionesTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createOrganizacionAction(
  input: CreateOrganizacionSchema,
) {
  const result = createOrganizacionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Datos del formulario inválidos." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "No autorizado." };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "ORGANIZACIONES",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { nombre } = result.data;

  try {
    await db.insert(organizacionesTabla).values({
      nombre,
    });

    revalidatePath("/dashboard/plataforma/organizaciones");

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        return {
          ok: false,
          message: "Ya existe una organización activa con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear la organización.",
    };
  }
}

export async function editOrganizacionAction(input: EditOrganizacionSchema) {
  const result = editOrganizacionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Datos del formulario inválidos." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "No autorizado." };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "ORGANIZACIONES",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { organizacionId, nombre } = result.data;

  try {
    const updatedOrganizacion = await db
      .update(organizacionesTabla)
      .set({
        nombre,
      })
      .where(
        and(
          eq(organizacionesTabla.id, organizacionId),
          eq(organizacionesTabla.activo, true),
        ),
      )
      .returning({ id: organizacionesTabla.id });

    if (updatedOrganizacion.length === 0) {
      return {
        ok: false,
        message: "La organización no existe o está inactiva.",
      };
    }

    revalidatePath("/dashboard/plataforma/organizaciones");

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        return {
          ok: false,
          message: "Ya existe una organización activa con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al editar la organización.",
    };
  }
}
