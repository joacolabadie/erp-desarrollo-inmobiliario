"use server";

import {
  createModuloSchema,
  type CreateModuloSchema,
} from "@/features/plataforma/modulos/routes/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { modulos as modulosTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
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
