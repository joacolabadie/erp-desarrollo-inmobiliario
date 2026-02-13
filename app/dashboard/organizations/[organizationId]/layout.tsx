import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones, organizacionesMiembros } from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

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

  const organization = await db
    .select({ id: organizaciones.id })
    .from(organizacionesMiembros)
    .innerJoin(
      organizaciones,
      eq(organizaciones.id, organizacionesMiembros.organizacionId),
    )
    .where(
      and(
        eq(organizacionesMiembros.organizacionId, organizationId),
        eq(organizacionesMiembros.usuarioId, session.user.id),
        eq(organizacionesMiembros.estado, "activo"),
        eq(organizacionesMiembros.activo, true),
        eq(organizaciones.activo, true),
      ),
    )
    .limit(1);

  if (organization.length === 0) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
