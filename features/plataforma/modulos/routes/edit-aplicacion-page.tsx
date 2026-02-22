import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { EditAplicacionForm } from "@/features/plataforma/modulos/routes/edit-aplicacion-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditAplicacionPageProps = {
  moduloId: string;
  aplicacionId: string;
};

export default async function EditAplicacionPage({
  moduloId,
  aplicacionId,
}: EditAplicacionPageProps) {
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

  const aplicacion = await db
    .select({
      id: aplicacionesTabla.id,
      clave: aplicacionesTabla.clave,
      slug: aplicacionesTabla.slug,
      nombre: aplicacionesTabla.nombre,
      scope: aplicacionesTabla.scope,
    })
    .from(aplicacionesTabla)
    .where(
      and(
        eq(aplicacionesTabla.id, aplicacionId),
        eq(aplicacionesTabla.moduloId, moduloId),
        eq(aplicacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (aplicacion.length === 0) {
    redirect(`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`);
  }

  return (
    <>
      <SetBreadcrumbExtras
        extras={[
          { label: modulo[0].nombre },
          { label: "Aplicaciones" },
          { label: aplicacion[0].nombre },
          { label: "Editar" },
        ]}
      />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Editar aplicación</h1>
            <Button variant="ghost" asChild>
              <Link
                href={`/dashboard/plataforma/modulos/${moduloId}/aplicaciones`}
              >
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <EditAplicacionForm
            moduloId={moduloId}
            aplicacionId={aplicacion[0].id}
            clave={aplicacion[0].clave}
            slug={aplicacion[0].slug}
            nombre={aplicacion[0].nombre}
            scope={aplicacion[0].scope}
          />
        </div>
      </main>
    </>
  );
}
