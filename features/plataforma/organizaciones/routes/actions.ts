"use server";

import {
  crearOrganizacionSchema,
  type CrearOrganizacionSchema,
} from "@/features/plataforma/organizaciones/routes/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones as organizacionesTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function crearOrganizacionAction(input: CrearOrganizacionSchema) {
  const result = crearOrganizacionSchema.safeParse(input);

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
    clave: "ORGANIZACIONES",
  });

  if (!allowed) {
    return { ok: false, message: "Unauthorized" };
  }

  const { nombre } = result.data;

  try {
    await db.insert(organizacionesTabla).values({
      nombre,
    });

    revalidatePath("/dashboard/plataforma/organizaciones");

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al crear la organización.",
    };
  }
}
