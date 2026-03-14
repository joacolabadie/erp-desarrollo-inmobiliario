import { SetBreadcrumbExtras } from "@/components/dashboard/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { AplicacionesTable } from "@/features/plataforma/modulos/routes/aplicaciones/components/aplicaciones-table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  aplicaciones as aplicacionesTabla,
  modulos as modulosTabla,
} from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { isValidUuid } from "@/lib/utils/validation/is-valid-uuid";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type AplicacionesListProps = {
  moduloId: string;
};

export default async function AplicacionesList({
  moduloId,
}: AplicacionesListProps) {
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

  if (!isValidUuid({ value: moduloId })) {
    redirect("/dashboard/plataforma/modulos");
  }

  const modulo = await db
    .select({
      id: modulosTabla.id,
      nombre: modulosTabla.nombre,
    })
    .from(modulosTabla)
    .where(eq(modulosTabla.id, moduloId))
    .limit(1);

  if (modulo.length === 0) {
    redirect("/dashboard/plataforma/modulos");
  }

  const aplicaciones = await db
    .select({
      id: aplicacionesTabla.id,
      clave: aplicacionesTabla.clave,
      slug: aplicacionesTabla.slug,
      nombre: aplicacionesTabla.nombre,
      scope: aplicacionesTabla.scope,
    })
    .from(aplicacionesTabla)
    .where(eq(aplicacionesTabla.moduloId, moduloId))
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
              <Link href="/dashboard/plataforma/modulos">
                <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
                Volver
              </Link>
            </Button>
          </div>
          <AplicacionesTable moduloId={moduloId} aplicaciones={aplicaciones} />
        </div>
      </main>
    </>
  );
}
