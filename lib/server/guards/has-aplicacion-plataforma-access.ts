import { db } from "@/lib/server/db";
import {
  plataformaAdministradoresAplicaciones as plataformaAdministradoresAplicacionesTabla,
  plataformaAdministradores as plataformaAdministradoresTabla,
  plataformaAplicaciones as plataformaAplicacionesTabla,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";

type HasAplicacionPlataformaAccessParams = {
  userId: string;
  clave: string;
};

export async function hasAplicacionPlataformaAccess({
  userId,
  clave,
}: HasAplicacionPlataformaAccessParams): Promise<boolean> {
  const aplicacionPlataforma = await db
    .select({
      id: plataformaAplicacionesTabla.id,
    })
    .from(plataformaAdministradoresAplicacionesTabla)
    .innerJoin(
      plataformaAdministradoresTabla,
      eq(
        plataformaAdministradoresTabla.id,
        plataformaAdministradoresAplicacionesTabla.plataformaAdministradorId,
      ),
    )
    .innerJoin(
      plataformaAplicacionesTabla,
      eq(
        plataformaAplicacionesTabla.id,
        plataformaAdministradoresAplicacionesTabla.plataformaAplicacionId,
      ),
    )
    .where(
      and(
        eq(plataformaAdministradoresAplicacionesTabla.activo, true),
        eq(plataformaAdministradoresTabla.usuarioId, userId),
        eq(plataformaAdministradoresTabla.activo, true),
        eq(plataformaAplicacionesTabla.clave, clave),
        eq(plataformaAplicacionesTabla.activo, true),
      ),
    )
    .limit(1);

  return aplicacionPlataforma.length > 0;
}
