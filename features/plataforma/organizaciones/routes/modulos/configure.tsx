import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { ModulosConfigureForm } from "@/features/plataforma/organizaciones/routes/modulos/components/configure-form";
import type { Aplicacion } from "@/features/plataforma/organizaciones/shared/types";
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

type ModulosConfigureProps = {
  organizacionId: string;
};

export default async function ModulosConfigure({
  organizacionId,
}: ModulosConfigureProps) {
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

  const allModulos = await db
    .select({
      id: modulosTabla.id,
      nombre: modulosTabla.nombre,
    })
    .from(modulosTabla)
    .where(eq(modulosTabla.activo, true))
    .orderBy(asc(modulosTabla.nombre), asc(modulosTabla.id));

  const allAplicaciones = await db
    .select({
      id: aplicacionesTabla.id,
      moduloId: aplicacionesTabla.moduloId,
      nombre: aplicacionesTabla.nombre,
    })
    .from(aplicacionesTabla)
    .where(eq(aplicacionesTabla.activo, true))
    .orderBy(asc(aplicacionesTabla.nombre), asc(aplicacionesTabla.id));

  const enabledAplicaciones = await db
    .select({
      aplicacionId: organizacionesAplicacionesTabla.aplicacionId,
    })
    .from(organizacionesAplicacionesTabla)
    .where(
      and(
        eq(organizacionesAplicacionesTabla.organizacionId, organizacionId),
        eq(organizacionesAplicacionesTabla.activo, true),
      ),
    );

  const enabledAplicacionesIds = enabledAplicaciones.map(
    (enabledAplicacion) => enabledAplicacion.aplicacionId,
  );

  const aplicacionesByModulo = new Map<string, Aplicacion[]>();

  for (const aplicacion of allAplicaciones) {
    const list = aplicacionesByModulo.get(aplicacion.moduloId) ?? [];

    list.push({
      id: aplicacion.id,
      nombre: aplicacion.nombre,
    });

    aplicacionesByModulo.set(aplicacion.moduloId, list);
  }

  const modulosWithAplicaciones = allModulos.map((modulo) => ({
    id: modulo.id,
    nombre: modulo.nombre,
    aplicaciones: aplicacionesByModulo.get(modulo.id) ?? [],
  }));

  return (
    <>
      <SetBreadcrumbExtras
        extras={[
          { label: organizacion[0].nombre },
          {
            label: "Módulos",
            href: `/dashboard/plataforma/organizaciones/${organizacionId}/modulos`,
          },
          { label: "Configurar" },
        ]}
      />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Configurar módulos</h1>
            <Button variant="ghost" asChild>
              <Link
                href={`/dashboard/plataforma/organizaciones/${organizacionId}/modulos`}
              >
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <ModulosConfigureForm
            organizacionId={organizacionId}
            modulos={modulosWithAplicaciones}
            enabledAplicacionIds={enabledAplicacionesIds}
          />
        </div>
      </main>
    </>
  );
}
