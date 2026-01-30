import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesMiembros,
  organizacionesMiembrosProyectos,
  proyectos,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const project = await db
    .select({
      nombre: proyectos.nombre,
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
    .where(
      and(
        eq(organizacionesMiembrosProyectos.organizacionId, organizationId),
        eq(organizacionesMiembrosProyectos.proyectoId, projectId),
        eq(organizacionesMiembrosProyectos.usuarioId, session.user.id),
        eq(organizacionesMiembrosProyectos.activo, true),
        eq(organizacionesMiembros.estado, "activo"),
        eq(organizacionesMiembros.activo, true),
        eq(proyectos.organizacionId, organizationId),
        eq(proyectos.activo, true),
      ),
    )
    .limit(1);

  if (project.length === 0) {
    redirect(`/dashboard/organizations/${organizationId}`);
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-lg">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-balance">
            Bienvenido, {session.user.name}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Explorá las secciones de {project[0].nombre} desde esta vista.
          </p>
        </div>
      </div>
    </div>
  );
}
