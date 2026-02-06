import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones, organizacionesMiembros } from "@/lib/server/db/schema";
import {
  platformAdmins,
  platformAdminsAplicaciones,
  platformAplicaciones,
} from "@/lib/server/db/schema/platform";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type PlatformApplication = {
  id: string;
  slug: string;
  nombre: string;
};

export default async function PlatformLayout({
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
        projects={[]}
        modules={[]}
        platformApplications={platformApplications}
        user={{ name: session.user.name, email: session.user.email }}
      />
      <SidebarInset className="flex-col">
        <AppHeader platformApplications={platformApplications} />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
