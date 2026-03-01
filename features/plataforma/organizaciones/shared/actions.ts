"use server";

import {
  modulosConfigureSchema,
  organizacionCreateSchema,
  organizacionEditSchema,
  type ModulosConfigureSchema,
  type OrganizacionCreateSchema,
  type OrganizacionEditSchema,
} from "@/features/plataforma/organizaciones/shared/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesAplicaciones as organizacionesAplicacionesTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, DrizzleQueryError, eq, inArray, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function organizacionCreateAction(
  input: OrganizacionCreateSchema,
) {
  const result = organizacionCreateSchema.safeParse(input);

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

export async function organizacionEditAction(input: OrganizacionEditSchema) {
  const result = organizacionEditSchema.safeParse(input);

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

export async function modulosConfigureAction(input: ModulosConfigureSchema) {
  const result = modulosConfigureSchema.safeParse(input);

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

  const { organizacionId, aplicacionIds } = result.data;

  try {
    await db.transaction(async (tx) => {
      if (aplicacionIds.length === 0) {
        await tx
          .update(organizacionesAplicacionesTabla)
          .set({ activo: false })
          .where(
            and(
              eq(
                organizacionesAplicacionesTabla.organizacionId,
                organizacionId,
              ),
              eq(organizacionesAplicacionesTabla.activo, true),
            ),
          );
        return;
      }

      await tx
        .update(organizacionesAplicacionesTabla)
        .set({ activo: false })
        .where(
          and(
            eq(organizacionesAplicacionesTabla.organizacionId, organizacionId),
            eq(organizacionesAplicacionesTabla.activo, true),
            notInArray(
              organizacionesAplicacionesTabla.aplicacionId,
              aplicacionIds,
            ),
          ),
        );

      const activeExisting = await tx
        .select({ aplicacionId: organizacionesAplicacionesTabla.aplicacionId })
        .from(organizacionesAplicacionesTabla)
        .where(
          and(
            eq(organizacionesAplicacionesTabla.organizacionId, organizacionId),
            eq(organizacionesAplicacionesTabla.activo, true),
            inArray(
              organizacionesAplicacionesTabla.aplicacionId,
              aplicacionIds,
            ),
          ),
        );

      const activeSet = new Set(activeExisting.map((r) => r.aplicacionId));
      const missingActive = aplicacionIds.filter((id) => !activeSet.has(id));

      if (missingActive.length > 0) {
        await tx.insert(organizacionesAplicacionesTabla).values(
          missingActive.map((aplicacionId) => ({
            organizacionId,
            aplicacionId,
            activo: true,
          })),
        );
      }
    });

    revalidatePath(
      `/dashboard/plataforma/organizaciones/${organizacionId}/modulos`,
    );

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        return {
          ok: false,
          message:
            "Ya existe una aplicación activa asignada a esta organización.",
        };
      }
    }

    return {
      ok: false,
      message:
        "Ocurrió un error inesperado al configurar los módulos de la organización.",
    };
  }
}
