import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { MiembrosTable } from "@/features/plataforma/organizaciones/routes/miembros/components/table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
  users as usersTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { isValidUuid } from "@/lib/utils/validation/is-valid-uuid";
import { and, asc, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type MiembrosListProps = {
  organizacionId: string;
};

export default async function MiembrosList({
  organizacionId,
}: MiembrosListProps) {
  if (!isValidUuid(organizacionId)) {
    redirect("/dashboard/plataforma/organizaciones");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "ORGANIZACIONES",
  });

  if (!allowed) {
    redirect("/dashboard");
  }

  const organizacion = await db
    .select({
      id: organizacionesTabla.id,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesTabla)
    .where(
      and(
        eq(organizacionesTabla.id, organizacionId),
        eq(organizacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (organizacion.length === 0) {
    redirect("/dashboard/plataforma/organizaciones");
  }

  const miembros = await db
    .select({
      id: organizacionesMiembrosTabla.id,
      nombre: usersTabla.name,
      email: usersTabla.email,
      rol: organizacionesMiembrosTabla.rol,
      estado: organizacionesMiembrosTabla.estado,
    })
    .from(organizacionesMiembrosTabla)
    .innerJoin(
      usersTabla,
      eq(organizacionesMiembrosTabla.usuarioId, usersTabla.id),
    )
    .where(
      and(
        eq(organizacionesMiembrosTabla.organizacionId, organizacionId),
        eq(organizacionesMiembrosTabla.activo, true),
      ),
    )
    .orderBy(
      asc(usersTabla.name),
      asc(usersTabla.email),
      asc(organizacionesMiembrosTabla.id),
    );

  return (
    <>
      <SetBreadcrumbExtras
        extras={[{ label: organizacion[0].nombre }, { label: "Miembros" }]}
      />
      <main className="px-4 py-12">
        <div className="container mx-auto space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Miembros</h1>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/plataforma/organizaciones">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <MiembrosTable organizacionId={organizacionId} miembros={miembros} />
        </div>
      </main>
    </>
  );
}
