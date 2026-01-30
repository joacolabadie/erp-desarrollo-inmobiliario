import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones, organizacionesMiembros } from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizationPage({
  params,
}: {
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

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-lg">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-balance">
            Bienvenido, {session.user.name}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Explorá las secciones de {organization[0].nombre} desde esta vista.
          </p>
        </div>
      </div>
    </div>
  );
}
