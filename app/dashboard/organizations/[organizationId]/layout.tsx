import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
  proyectos,
} from "@/lib/server/db/schema";
import {
  platformAdmins,
  platformAdminsAplicaciones,
  platformAplicaciones,
} from "@/lib/server/db/schema/platform";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Application = {
  id: string;
  slug: string;
  nombre: string;
  scope: "organizacional" | "proyecto" | "mixto";
};

type Module = {
  id: string;
  slug: string;
  nombre: string;
  aplicaciones: Application[];
};

type PlatformApplication = {
  id: string;
  slug: string;
  nombre: string;
};

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const organizations = await db
    .select({
      id: organizaciones.id,
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
        eq(organizaciones.activo, true),
      ),
    )
    .orderBy(asc(organizaciones.nombre), asc(organizaciones.id));

  if (
    organizations.length === 0 ||
    !organizations.some((organization) => organization.id === organizationId)
  ) {
    redirect("/dashboard");
  }

  const projects = await db
    .select({
      id: proyectos.id,
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
        eq(organizacionesMiembrosProyectos.organizacionId, organizationId),
        eq(organizacionesMiembrosProyectos.usuarioId, session.user.id),
        eq(organizacionesMiembrosProyectos.activo, true),
        eq(organizacionesMiembros.estado, "activo"),
        eq(organizacionesMiembros.activo, true),
        eq(proyectos.organizacionId, organizationId),
        eq(proyectos.activo, true),
        eq(organizaciones.activo, true),
      ),
    )
    .orderBy(asc(proyectos.nombre), asc(proyectos.id));

  const applications = await db
    .select({
      moduloId: modulos.id,
      moduloSlug: modulos.slug,
      moduloNombre: modulos.nombre,
      aplicacionId: aplicaciones.id,
      aplicacionSlug: aplicaciones.slug,
      aplicacionNombre: aplicaciones.nombre,
      aplicacionScope: aplicaciones.scope,
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
      eq(organizaciones.id, organizacionesMiembrosAplicaciones.organizacionId),
    )
    .innerJoin(modulos, eq(modulos.id, aplicaciones.moduloId))
    .where(
      and(
        eq(organizacionesMiembrosAplicaciones.organizacionId, organizationId),
        eq(organizacionesMiembrosAplicaciones.usuarioId, session.user.id),
        eq(organizacionesMiembrosAplicaciones.activo, true),
        eq(organizacionesMiembros.estado, "activo"),
        eq(organizacionesMiembros.activo, true),
        eq(aplicaciones.activo, true),
        eq(organizacionesAplicaciones.activo, true),
        eq(organizaciones.activo, true),
        eq(modulos.activo, true),
      ),
    )
    .orderBy(
      asc(modulos.nombre),
      asc(modulos.id),
      asc(aplicaciones.nombre),
      asc(aplicaciones.id),
    );

  const modules: Module[] = [];

  for (const application of applications) {
    let moduleItem = modules.find(
      (module) => module.id === application.moduloId,
    );

    if (!moduleItem) {
      moduleItem = {
        id: application.moduloId,
        slug: application.moduloSlug,
        nombre: application.moduloNombre,
        aplicaciones: [],
      };

      modules.push(moduleItem);
    }

    moduleItem.aplicaciones.push({
      id: application.aplicacionId,
      slug: application.aplicacionSlug,
      nombre: application.aplicacionNombre,
      scope: application.aplicacionScope,
    });
  }

  const platformApplications: PlatformApplication[] = await db
    .select({
      id: platformAplicaciones.id,
      slug: platformAplicaciones.slug,
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
        eq(platformAplicaciones.activo, true),
      ),
    )
    .orderBy(asc(platformAplicaciones.nombre), asc(platformAplicaciones.id));

  return (
    <SidebarProvider>
      <AppSidebar
        organizations={organizations}
        projects={projects}
        modules={modules}
        platformApplications={platformApplications}
        user={{ name: session.user.name, email: session.user.email }}
      />
      <SidebarInset className="flex-col">
        <AppHeader
          organizations={organizations}
          projects={projects}
          modules={modules}
        />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
