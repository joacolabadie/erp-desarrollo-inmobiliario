import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function OrganizacionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizacionId: string }>;
}) {
  const { organizacionId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const organizacion = await db
    .select({ id: organizacionesTabla.id })
    .from(organizacionesMiembrosTabla)
    .innerJoin(
      organizacionesTabla,
      eq(organizacionesTabla.id, organizacionesMiembrosTabla.organizacionId),
    )
    .where(
      and(
        eq(organizacionesMiembrosTabla.organizacionId, organizacionId),
        eq(organizacionesMiembrosTabla.usuarioId, session.user.id),
        eq(organizacionesMiembrosTabla.estado, "activo"),
        eq(organizacionesMiembrosTabla.activo, true),
        eq(organizacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (organizacion.length === 0) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
