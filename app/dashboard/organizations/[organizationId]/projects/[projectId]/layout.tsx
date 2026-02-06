import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizaciones,
  organizacionesMiembros,
  organizacionesMiembrosProyectos,
  proyectos,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const projects = await db
    .select({
      id: proyectos.id,
    })
    .from(organizacionesMiembrosProyectos)
    .innerJoin(
      organizacionesMiembros,
      and(
        eq(
          organizacionesMiembros.organizacionId,
          organizacionesMiembrosProyectos.organizacionId,
        ),
        eq(
          organizacionesMiembros.usuarioId,
          organizacionesMiembrosProyectos.usuarioId,
        ),
      ),
    )
    .innerJoin(
      proyectos,
      eq(proyectos.id, organizacionesMiembrosProyectos.proyectoId),
    )
    .innerJoin(
      organizaciones,
      eq(organizaciones.id, organizacionesMiembrosProyectos.organizacionId),
    )
    .where(
      and(
        eq(organizacionesMiembrosProyectos.organizacionId, organizationId),
        eq(organizacionesMiembrosProyectos.usuarioId, session.user.id),
        eq(organizacionesMiembrosProyectos.activo, true),
        eq(organizacionesMiembros.estado, "activo"),
        eq(organizacionesMiembros.activo, true),
        eq(proyectos.organizacionId, organizationId),
        eq(proyectos.activo, true),
        eq(organizaciones.activo, true),
      ),
    );

  if (
    projects.length === 0 ||
    !projects.some((project) => project.id === projectId)
  ) {
    redirect(`/dashboard/organizations/${organizationId}`);
  }

  return <>{children}</>;
}
