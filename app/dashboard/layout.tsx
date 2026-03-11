import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbExtrasProvider } from "@/components/breadcrumb-extras";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
  organizacionesMiembrosAplicaciones as organizacionesMiembrosAplicacionesTabla,
  organizacionesMiembrosProyectos as organizacionesMiembrosProyectosTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
  plataformaAdministradoresAplicaciones as plataformaAdministradoresAplicacionesTabla,
  plataformaAdministradores as plataformaAdministradoresTabla,
  plataformaAplicaciones as plataformaAplicacionesTabla,
  proyectos as proyectosTabla,
} from "@/lib/server/db/schema";
import type { Modulo } from "@/lib/types/dashboard";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const [organizaciones, proyectos, aplicaciones, aplicacionesPlataforma] =
    await Promise.all([
      db
        .select({
          id: organizacionesTabla.id,
          nombre: organizacionesTabla.nombre,
        })
        .from(organizacionesMiembrosTabla)
        .innerJoin(
          organizacionesTabla,
          eq(
            organizacionesTabla.id,
            organizacionesMiembrosTabla.organizacionId,
          ),
        )
        .where(
          and(
            eq(organizacionesMiembrosTabla.usuarioId, session.user.id),
            eq(organizacionesMiembrosTabla.estado, "activo"),
          ),
        )
        .orderBy(asc(organizacionesTabla.nombre), asc(organizacionesTabla.id)),
      db
        .select({
          id: proyectosTabla.id,
          organizacionId: proyectosTabla.organizacionId,
          nombre: proyectosTabla.nombre,
        })
        .from(organizacionesMiembrosProyectosTabla)
        .innerJoin(
          proyectosTabla,
          and(
            eq(
              proyectosTabla.id,
              organizacionesMiembrosProyectosTabla.proyectoId,
            ),
            eq(
              proyectosTabla.organizacionId,
              organizacionesMiembrosProyectosTabla.organizacionId,
            ),
          ),
        )
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
            eq(organizacionesMiembrosProyectosTabla.usuarioId, session.user.id),
            eq(organizacionesMiembrosTabla.estado, "activo"),
          ),
        )
        .orderBy(asc(proyectosTabla.nombre), asc(proyectosTabla.id)),
      db
        .select({
          organizacionId:
            organizacionesMiembrosAplicacionesTabla.organizacionId,
          moduloId: modulosTabla.id,
          moduloSlug: modulosTabla.slug,
          moduloNombre: modulosTabla.nombre,
          aplicacionId: aplicacionesTabla.id,
          aplicacionSlug: aplicacionesTabla.slug,
          aplicacionNombre: aplicacionesTabla.nombre,
          aplicacionScope: aplicacionesTabla.scope,
        })
        .from(organizacionesMiembrosAplicacionesTabla)
        .innerJoin(
          aplicacionesTabla,
          eq(
            aplicacionesTabla.id,
            organizacionesMiembrosAplicacionesTabla.aplicacionId,
          ),
        )
        .innerJoin(
          modulosTabla,
          eq(modulosTabla.id, aplicacionesTabla.moduloId),
        )
        .innerJoin(
          organizacionesMiembrosTabla,
          and(
            eq(
              organizacionesMiembrosTabla.organizacionId,
              organizacionesMiembrosAplicacionesTabla.organizacionId,
            ),
            eq(
              organizacionesMiembrosTabla.usuarioId,
              organizacionesMiembrosAplicacionesTabla.usuarioId,
            ),
          ),
        )
        .where(
          and(
            eq(
              organizacionesMiembrosAplicacionesTabla.usuarioId,
              session.user.id,
            ),
            eq(organizacionesMiembrosTabla.estado, "activo"),
          ),
        )
        .orderBy(
          asc(modulosTabla.nombre),
          asc(modulosTabla.id),
          asc(aplicacionesTabla.nombre),
          asc(aplicacionesTabla.id),
        ),
      db
        .select({
          id: plataformaAplicacionesTabla.id,
          slug: plataformaAplicacionesTabla.slug,
          nombre: plataformaAplicacionesTabla.nombre,
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
        .where(eq(plataformaAdministradoresTabla.usuarioId, session.user.id))
        .orderBy(
          asc(plataformaAplicacionesTabla.nombre),
          asc(plataformaAplicacionesTabla.id),
        ),
    ]);

  const modulos: Modulo[] = [];

  for (const aplicacion of aplicaciones) {
    let modulo = modulos.find(
      (modulo) =>
        modulo.organizacionId === aplicacion.organizacionId &&
        modulo.id === aplicacion.moduloId,
    );

    if (!modulo) {
      modulo = {
        organizacionId: aplicacion.organizacionId,
        id: aplicacion.moduloId,
        slug: aplicacion.moduloSlug,
        nombre: aplicacion.moduloNombre,
        aplicaciones: [],
      };

      modulos.push(modulo);
    }

    modulo.aplicaciones.push({
      id: aplicacion.aplicacionId,
      slug: aplicacion.aplicacionSlug,
      nombre: aplicacion.aplicacionNombre,
      scope: aplicacion.aplicacionScope,
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar
        organizaciones={organizaciones}
        proyectos={proyectos}
        modulos={modulos}
        aplicacionesPlataforma={aplicacionesPlataforma}
        user={{ name: session.user.name, email: session.user.email }}
      />
      <SidebarInset className="h-svh overflow-hidden">
        <BreadcrumbExtrasProvider>
          <AppHeader
            organizaciones={organizaciones}
            proyectos={proyectos}
            modulos={modulos}
            aplicacionesPlataforma={aplicacionesPlataforma}
          />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </BreadcrumbExtrasProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
