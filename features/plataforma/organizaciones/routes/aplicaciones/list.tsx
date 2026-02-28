import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { AplicacionesTable } from "@/features/plataforma/organizaciones/routes/aplicaciones/components/table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
  organizacionesAplicaciones as organizacionesAplicacionesTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { isValidUuid } from "@/lib/utils/validation/is-valid-uuid";
import { and, asc, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type AplicacionesListProps = {
  organizacionId: string;
  moduloId: string;
};

export default async function AplicacionesList({
  organizacionId,
  moduloId,
}: AplicacionesListProps) {
  if (!isValidUuid(organizacionId)) {
    redirect("/dashboard/plataforma/organizaciones");
  }

  if (!isValidUuid(moduloId)) {
    redirect(`/dashboard/plataforma/organizaciones/${organizacionId}/modulos`);
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

  const modulo = await db
    .select({
      id: modulosTabla.id,
      nombre: modulosTabla.nombre,
    })
    .from(organizacionesAplicacionesTabla)
    .innerJoin(
      aplicacionesTabla,
      eq(organizacionesAplicacionesTabla.aplicacionId, aplicacionesTabla.id),
    )
    .innerJoin(modulosTabla, eq(aplicacionesTabla.moduloId, modulosTabla.id))
    .where(
      and(
        eq(organizacionesAplicacionesTabla.organizacionId, organizacionId),
        eq(organizacionesAplicacionesTabla.activo, true),
        eq(aplicacionesTabla.activo, true),
        eq(modulosTabla.id, moduloId),
        eq(modulosTabla.activo, true),
      ),
    )
    .groupBy(modulosTabla.id, modulosTabla.nombre)
    .limit(1);

  if (modulo.length === 0) {
    redirect(`/dashboard/plataforma/organizaciones/${organizacionId}/modulos`);
  }

  const aplicaciones = await db
    .select({
      id: aplicacionesTabla.id,
      nombre: aplicacionesTabla.nombre,
    })
    .from(organizacionesAplicacionesTabla)
    .innerJoin(
      aplicacionesTabla,
      eq(organizacionesAplicacionesTabla.aplicacionId, aplicacionesTabla.id),
    )
    .where(
      and(
        eq(organizacionesAplicacionesTabla.organizacionId, organizacionId),
        eq(organizacionesAplicacionesTabla.activo, true),
        eq(aplicacionesTabla.moduloId, moduloId),
        eq(aplicacionesTabla.activo, true),
      ),
    )
    .orderBy(asc(aplicacionesTabla.nombre), asc(aplicacionesTabla.id));

  return (
    <>
      <SetBreadcrumbExtras
        extras={[
          { label: organizacion[0].nombre },
          { label: "Módulos" },
          { label: modulo[0].nombre },
          { label: "Aplicaciones" },
        ]}
      />
      <main className="px-4 py-12">
        <div className="container mx-auto space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Aplicaciones</h1>
            <Button variant="ghost" asChild>
              <Link
                href={`/dashboard/plataforma/organizaciones/${organizacionId}/modulos`}
              >
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <AplicacionesTable aplicaciones={aplicaciones} />
        </div>
      </main>
    </>
  );
}
