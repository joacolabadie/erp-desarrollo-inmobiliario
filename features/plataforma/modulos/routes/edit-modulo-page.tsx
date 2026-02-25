import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { EditModuloForm } from "@/features/plataforma/modulos/routes/edit-modulo-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { modulos as modulosTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { and, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditModuloPageProps = {
  moduloId: string;
};

export default async function EditModuloPage({
  moduloId,
}: EditModuloPageProps) {
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
      clave: modulosTabla.clave,
      slug: modulosTabla.slug,
      nombre: modulosTabla.nombre,
    })
    .from(modulosTabla)
    .where(and(eq(modulosTabla.id, moduloId), eq(modulosTabla.activo, true)))
    .limit(1);

  if (modulo.length === 0) {
    redirect("/dashboard/plataforma/modulos");
  }

  return (
    <>
      <SetBreadcrumbExtras
        extras={[{ label: modulo[0].nombre }, { label: "Editar" }]}
      />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Editar módulo</h1>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/plataforma/modulos">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <EditModuloForm
            moduloId={modulo[0].id}
            clave={modulo[0].clave}
            slug={modulo[0].slug}
            nombre={modulo[0].nombre}
          />
        </div>
      </main>
    </>
  );
}
