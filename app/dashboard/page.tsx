import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones, organizacionesMiembros } from "@/lib/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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

  if (organizations.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="w-full max-w-lg">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">
              No pertenecés a ninguna organización
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Por favor, contactá al administrador para que te agregue como
              miembro.
            </p>
          </div>
        </div>
      </div>
    );
  }

  redirect(`/dashboard/organizations/${organizations[0].id}`);
}
