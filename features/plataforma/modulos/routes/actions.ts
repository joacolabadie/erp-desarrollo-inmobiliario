"use server";

import {
  createAplicacionSchema,
  createModuloSchema,
  editAplicacionSchema,
  editModuloSchema,
  type CreateAplicacionSchema,
  type CreateModuloSchema,
  type EditAplicacionSchema,
  type EditModuloSchema,
} from "@/features/plataforma/modulos/routes/schema";
import { auth } from "@/lib/auth";
import type { AplicacionScope } from "@/lib/domain";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createModuloAction(input: CreateModuloSchema) {
  const result = createModuloSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Invalid form data" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "Unauthorized" };
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
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear el módulo.",
    };
  }
}

export async function editModuloAction(input: EditModuloSchema) {
  const result = editModuloSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Invalid form data" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "Unauthorized" };
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
      .where(and(eq(modulosTabla.id, moduloId), eq(modulosTabla.activo, true)))
      .returning({ id: modulosTabla.id });

    if (updatedModulo.length === 0) {
      return {
        ok: false,
        message: "El módulo no existe o está inactivo.",
      };
    }

    revalidatePath("/dashboard/plataforma/modulos");
    revalidatePath(`/dashboard/plataforma/modulos/${moduloId}/editar`);

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al editar el módulo.",
    };
  }
}

export async function createAplicacionAction(input: CreateAplicacionSchema) {
  const result = createAplicacionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Invalid form data" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "Unauthorized" };
  }

  const { moduloId, clave, slug, nombre } = result.data;

  const scope = result.data.scope as AplicacionScope;

  try {
    const modulo = await db
      .select({ id: modulosTabla.id })
      .from(modulosTabla)
      .where(and(eq(modulosTabla.id, moduloId), eq(modulosTabla.activo, true)))
      .limit(1);

    if (modulo.length === 0) {
      return {
        ok: false,
        message: "El módulo seleccionado no existe o está inactivo.",
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
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear la aplicación.",
    };
  }
}

export async function editAplicacionAction(input: EditAplicacionSchema) {
  const result = editAplicacionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: "Invalid form data" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    return { ok: false, message: "Unauthorized" };
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
          eq(aplicacionesTabla.activo, true),
        ),
      )
      .returning({ id: aplicacionesTabla.id });

    if (updatedAplicacion.length === 0) {
      return {
        ok: false,
        message: "La aplicación no existe o está inactiva.",
      };
    }

    revalidatePath(`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`);
    revalidatePath(
      `/dashboard/plataforma/modulos/${moduloId}/aplicaciones/${aplicacionId}/editar`,
    );

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al editar la aplicación.",
    };
  }
}
