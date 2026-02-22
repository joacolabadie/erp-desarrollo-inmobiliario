"use server";

import {
  createAplicacionSchema,
  createModuloSchema,
  editModuloSchema,
  type CreateAplicacionSchema,
  type CreateModuloSchema,
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
    await db
      .update(modulosTabla)
      .set({
        clave,
        slug,
        nombre,
      })
      .where(and(eq(modulosTabla.id, moduloId), eq(modulosTabla.activo, true)));

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
