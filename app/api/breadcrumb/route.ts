import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones,
  modulos,
  organizaciones,
  organizacionesAplicaciones,
  organizacionesMiembros,
  organizacionesMiembrosAplicaciones,
  organizacionesMiembrosProyectos,
  platformAdmins,
  platformAdminsAplicaciones,
  platformAplicaciones,
  proyectos,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type BreadcrumbRequest = {
  activeOrganizationId?: string | null;
  activeProjectId?: string | null;
  moduleSlug?: string | null;
  applicationSlug?: string | null;
  platformApplicationSlug?: string | null;
};

type BreadcrumbResponse = {
  activeOrganizationName: string | null;
  activeProjectName: string | null;
  moduleName: string | null;
  applicationName: string | null;
  platformApplicationName: string | null;
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BreadcrumbRequest;

  let activeOrganizationName: string | null = null;
  let activeProjectName: string | null = null;
  let moduleName: string | null = null;
  let applicationName: string | null = null;
  let platformApplicationName: string | null = null;

  if (body.activeOrganizationId) {
    const organization = await db
      .select({
        nombre: organizaciones.nombre,
      })
      .from(organizacionesMiembros)
      .innerJoin(
        organizaciones,
        eq(organizaciones.id, organizacionesMiembros.organizacionId),
      )
      .where(
        and(
          eq(organizacionesMiembros.usuarioId, session.user.id),
          eq(organizacionesMiembros.estado, "activo"),
          eq(organizacionesMiembros.activo, true),
          eq(organizaciones.id, body.activeOrganizationId),
          eq(organizaciones.activo, true),
        ),
      )
      .limit(1);

    activeOrganizationName = organization[0]?.nombre ?? null;
  }

  if (body.activeOrganizationId && body.activeProjectId) {
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
      .innerJoin(
        organizaciones,
        eq(organizaciones.id, organizacionesMiembrosProyectos.organizacionId),
      )
      .where(
        and(
          eq(
            organizacionesMiembrosProyectos.organizacionId,
            body.activeOrganizationId,
          ),
          eq(organizacionesMiembrosProyectos.usuarioId, session.user.id),
          eq(organizacionesMiembrosProyectos.activo, true),
          eq(organizacionesMiembros.estado, "activo"),
          eq(organizacionesMiembros.activo, true),
          eq(proyectos.id, body.activeProjectId),
          eq(proyectos.organizacionId, body.activeOrganizationId),
          eq(proyectos.activo, true),
          eq(organizaciones.activo, true),
        ),
      )
      .limit(1);

    activeProjectName = project[0]?.nombre ?? null;
  }

  if (body.activeOrganizationId && body.moduleSlug && body.applicationSlug) {
    const application = await db
      .select({
        moduloNombre: modulos.nombre,
        aplicacionNombre: aplicaciones.nombre,
      })
      .from(organizacionesMiembrosAplicaciones)
      .innerJoin(
        organizacionesMiembros,
        and(
          eq(
            organizacionesMiembros.organizacionId,
            organizacionesMiembrosAplicaciones.organizacionId,
          ),
          eq(
            organizacionesMiembros.usuarioId,
            organizacionesMiembrosAplicaciones.usuarioId,
          ),
        ),
      )
      .innerJoin(
        aplicaciones,
        eq(aplicaciones.id, organizacionesMiembrosAplicaciones.aplicacionId),
      )
      .innerJoin(
        organizacionesAplicaciones,
        and(
          eq(
            organizacionesAplicaciones.organizacionId,
            organizacionesMiembrosAplicaciones.organizacionId,
          ),
          eq(
            organizacionesAplicaciones.aplicacionId,
            organizacionesMiembrosAplicaciones.aplicacionId,
          ),
        ),
      )
      .innerJoin(
        organizaciones,
        eq(
          organizaciones.id,
          organizacionesMiembrosAplicaciones.organizacionId,
        ),
      )
      .innerJoin(modulos, eq(modulos.id, aplicaciones.moduloId))
      .where(
        and(
          eq(
            organizacionesMiembrosAplicaciones.organizacionId,
            body.activeOrganizationId,
          ),
          eq(organizacionesMiembrosAplicaciones.usuarioId, session.user.id),
          eq(organizacionesMiembrosAplicaciones.activo, true),
          eq(organizacionesMiembros.estado, "activo"),
          eq(organizacionesMiembros.activo, true),
          eq(aplicaciones.slug, body.applicationSlug),
          eq(aplicaciones.activo, true),
          eq(organizacionesAplicaciones.activo, true),
          eq(organizaciones.activo, true),
          eq(modulos.slug, body.moduleSlug),
          eq(modulos.activo, true),
        ),
      )
      .limit(1);

    moduleName = application[0]?.moduloNombre ?? null;
    applicationName = application[0]?.aplicacionNombre ?? null;
  }

  if (body.platformApplicationSlug) {
    const platformApplication = await db
      .select({
        nombre: platformAplicaciones.nombre,
      })
      .from(platformAdminsAplicaciones)
      .innerJoin(
        platformAdmins,
        eq(platformAdmins.id, platformAdminsAplicaciones.platformAdminId),
      )
      .innerJoin(
        platformAplicaciones,
        eq(
          platformAplicaciones.id,
          platformAdminsAplicaciones.platformAplicacionId,
        ),
      )
      .where(
        and(
          eq(platformAdminsAplicaciones.activo, true),
          eq(platformAdmins.usuarioId, session.user.id),
          eq(platformAdmins.activo, true),
          eq(platformAplicaciones.slug, body.platformApplicationSlug),
          eq(platformAplicaciones.activo, true),
        ),
      )
      .limit(1);

    platformApplicationName = platformApplication[0]?.nombre ?? null;
  }

  const response: BreadcrumbResponse = {
    activeOrganizationName,
    activeProjectName,
    moduleName,
    applicationName,
    platformApplicationName,
  };

  return NextResponse.json(response);
}
