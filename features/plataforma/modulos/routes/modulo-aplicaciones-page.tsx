import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { aplicacionesColumns } from "@/features/plataforma/modulos/routes/columns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, asc, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type ModuloAplicacionesPageProps = {
  moduloId: string;
};

export default async function ModuloAplicacionesPage({
  moduloId,
}: ModuloAplicacionesPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    redirect("/dashboard");
  }

  const modulo = await db
    .select({
      id: modulosTabla.id,
      nombre: modulosTabla.nombre,
    })
    .from(modulosTabla)
    .where(and(eq(modulosTabla.id, moduloId), eq(modulosTabla.activo, true)))
    .limit(1);

  if (modulo.length === 0) {
    redirect("/dashboard/plataforma/modulos");
  }

  const aplicaciones = await db
    .select({
      id: aplicacionesTabla.id,
      moduloId: aplicacionesTabla.moduloId,
      clave: aplicacionesTabla.clave,
      slug: aplicacionesTabla.slug,
      nombre: aplicacionesTabla.nombre,
      scope: aplicacionesTabla.scope,
    })
    .from(aplicacionesTabla)
    .where(
      and(
        eq(aplicacionesTabla.moduloId, moduloId),
        eq(aplicacionesTabla.activo, true),
      ),
    )
    .orderBy(asc(aplicacionesTabla.clave), asc(aplicacionesTabla.id));

  return (
    <>
      <SetBreadcrumbExtras
        extras={[{ label: modulo[0].nombre }, { label: "Aplicaciones" }]}
      />
      <main className="px-4 py-12">
        <div className="container mx-auto space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Aplicaciones</h1>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/plataforma/modulos/">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <DataTable
            columns={aplicacionesColumns}
            data={aplicaciones}
            search={{
              placeholder: "Buscar aplicacion...",
              columns: ["clave", "slug", "nombre"],
            }}
            action={{
              label: "Crear aplicacion",
              href: `/dashboard/plataforma/modulos/${moduloId}/aplicaciones/crear`,
              iconName: "plus",
            }}
          />
        </div>
      </main>
    </>
  );
}
