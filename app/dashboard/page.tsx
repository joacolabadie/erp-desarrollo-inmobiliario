import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema";
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

  const organizaciones = await db
    .select({
      id: organizacionesTabla.id,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesMiembrosTabla)
    .innerJoin(
      organizacionesTabla,
      eq(organizacionesTabla.id, organizacionesMiembrosTabla.organizacionId),
    )
    .where(
      and(
        eq(organizacionesMiembrosTabla.usuarioId, session.user.id),
        eq(organizacionesMiembrosTabla.estado, "activo"),
        eq(organizacionesMiembrosTabla.activo, true),
        eq(organizacionesTabla.activo, true),
      ),
    )
    .orderBy(asc(organizacionesTabla.nombre), asc(organizacionesTabla.id));

  if (organizaciones.length === 0) {
    return (
      <div className="grid min-h-full place-items-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold text-balance">
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

  redirect(`/dashboard/organizations/${organizaciones[0].id}`);
}
