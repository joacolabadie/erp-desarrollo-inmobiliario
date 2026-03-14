"use server";

import {
  aplicacionCreateSchema,
  aplicacionEditSchema,
  moduloCreateSchema,
  moduloEditSchema,
  type AplicacionCreateSchema,
  type AplicacionEditSchema,
  type ModuloCreateSchema,
  type ModuloEditSchema,
} from "@/features/plataforma/modulos/shared/schema";
import { auth } from "@/lib/auth";
import type { AplicacionScope } from "@/lib/domain";
import { db } from "@/lib/server/db";
import { generateConstraintName } from "@/lib/server/db/constraint-names";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function moduloCreateAction(input: ModuloCreateSchema) {
  const result = moduloCreateSchema.safeParse(input);

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
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { clave, slug, nombre } = result.data;

  try {
    await db.insert(modulosTabla).values({
      clave,
      slug,
      nombre,
    });

    revalidatePath("/dashboard/plataforma/modulos");

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        const constraint = (cause as Record<string, unknown>)["constraint"];

        if (
          constraint ===
          generateConstraintName({
            table: "modulos",
            kind: "uq",
            parts: ["clave"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe un módulo con esta clave.",
          };
        }

        if (
          constraint ===
          generateConstraintName({
            table: "modulos",
            kind: "uq",
            parts: ["slug"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe un módulo con este slug.",
          };
        }

        return {
          ok: false,
          message: "Ya existe un módulo con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear el módulo.",
    };
  }
}

export async function moduloEditAction(input: ModuloEditSchema) {
  const result = moduloEditSchema.safeParse(input);

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
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { moduloId, clave, slug, nombre } = result.data;

  try {
    const updatedModulo = await db
      .update(modulosTabla)
      .set({
        clave,
        slug,
        nombre,
      })
      .where(eq(modulosTabla.id, moduloId))
      .returning({ id: modulosTabla.id });

    if (updatedModulo.length === 0) {
      return {
        ok: false,
        message: "El módulo no existe.",
      };
    }

    revalidatePath("/dashboard/plataforma/modulos");

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        const constraint = (cause as Record<string, unknown>)["constraint"];

        if (
          constraint ===
          generateConstraintName({
            table: "modulos",
            kind: "uq",
            parts: ["clave"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe un módulo con esta clave.",
          };
        }

        if (
          constraint ===
          generateConstraintName({
            table: "modulos",
            kind: "uq",
            parts: ["slug"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe un módulo con este slug.",
          };
        }

        return {
          ok: false,
          message: "Ya existe un módulo con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al editar el módulo.",
    };
  }
}

export async function aplicacionCreateAction(input: AplicacionCreateSchema) {
  const result = aplicacionCreateSchema.safeParse(input);

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
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { moduloId, clave, slug, nombre } = result.data;

  const scope = result.data.scope as AplicacionScope;

  try {
    const modulo = await db
      .select({ id: modulosTabla.id })
      .from(modulosTabla)
      .where(eq(modulosTabla.id, moduloId))
      .limit(1);

    if (modulo.length === 0) {
      return {
        ok: false,
        message: "El módulo seleccionado no existe.",
      };
    }

    await db.insert(aplicacionesTabla).values({
      moduloId,
      clave,
      slug,
      nombre,
      scope,
    });

    revalidatePath(`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`);

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        const constraint = (cause as Record<string, unknown>)["constraint"];

        if (
          constraint ===
          generateConstraintName({
            table: "aplicaciones",
            kind: "uq",
            parts: ["modulo_id", "clave"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe una aplicación en este módulo con esta clave.",
          };
        }

        if (
          constraint ===
          generateConstraintName({
            table: "aplicaciones",
            kind: "uq",
            parts: ["modulo_id", "slug"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe una aplicación en este módulo con este slug.",
          };
        }

        return {
          ok: false,
          message: "Ya existe una aplicación en este módulo con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear la aplicación.",
    };
  }
}

export async function aplicacionEditAction(input: AplicacionEditSchema) {
  const result = aplicacionEditSchema.safeParse(input);

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
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "No autorizado." };
  }

  const { moduloId, aplicacionId, clave, slug, nombre } = result.data;

  const scope = result.data.scope as AplicacionScope;

  try {
    const updatedAplicacion = await db
      .update(aplicacionesTabla)
      .set({
        clave,
        slug,
        nombre,
        scope,
      })
      .where(
        and(
          eq(aplicacionesTabla.id, aplicacionId),
          eq(aplicacionesTabla.moduloId, moduloId),
        ),
      )
      .returning({ id: aplicacionesTabla.id });

    if (updatedAplicacion.length === 0) {
      return {
        ok: false,
        message: "La aplicación no existe.",
      };
    }

    revalidatePath(`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`);

    return { ok: true };
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        const constraint = (cause as Record<string, unknown>)["constraint"];

        if (
          constraint ===
          generateConstraintName({
            table: "aplicaciones",
            kind: "uq",
            parts: ["modulo_id", "clave"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe una aplicación en este módulo con esta clave.",
          };
        }

        if (
          constraint ===
          generateConstraintName({
            table: "aplicaciones",
            kind: "uq",
            parts: ["modulo_id", "slug"],
          })
        ) {
          return {
            ok: false,
            message: "Ya existe una aplicación en este módulo con este slug.",
          };
        }

        return {
          ok: false,
          message: "Ya existe una aplicación en este módulo con estos datos.",
        };
      }
    }

    return {
      ok: false,
      message: "Ocurrió un error inesperado al editar la aplicación.",
    };
  }
}
