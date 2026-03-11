import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesMiembrosProyectos as organizacionesMiembrosProyectosTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProyectoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{
    organizacionId: string;
    proyectoId: string;
  }>;
}) {
  const { organizacionId, proyectoId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const proyecto = await db
    .select({
      id: organizacionesMiembrosProyectosTabla.proyectoId,
    })
    .from(organizacionesMiembrosProyectosTabla)
    .innerJoin(
      organizacionesMiembrosTabla,
      and(
        eq(
          organizacionesMiembrosTabla.organizacionId,
          organizacionesMiembrosProyectosTabla.organizacionId,
        ),
        eq(
          organizacionesMiembrosTabla.usuarioId,
          organizacionesMiembrosProyectosTabla.usuarioId,
        ),
      ),
    )
    .where(
      and(
        eq(organizacionesMiembrosProyectosTabla.organizacionId, organizacionId),
        eq(organizacionesMiembrosProyectosTabla.usuarioId, session.user.id),
        eq(organizacionesMiembrosProyectosTabla.proyectoId, proyectoId),
        eq(organizacionesMiembrosTabla.estado, "activo"),
      ),
    )
    .limit(1);

  if (proyecto.length === 0) {
    redirect(`/dashboard/organizaciones/${organizacionId}`);
  }

  return <>{children}</>;
}
