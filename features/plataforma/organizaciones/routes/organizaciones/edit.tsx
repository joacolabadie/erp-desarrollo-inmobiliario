import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { OrganizacionEditForm } from "@/features/plataforma/organizaciones/routes/organizaciones/components/edit-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones as organizacionesTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { isValidUuid } from "@/lib/utils/validation/is-valid-uuid";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type OrganizacionEditProps = {
  organizacionId: string;
};

export default async function OrganizacionEdit({
  organizacionId,
}: OrganizacionEditProps) {
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
      identificadorCliente: organizacionesTabla.identificadorCliente,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesTabla)
    .where(eq(organizacionesTabla.id, organizacionId))
    .limit(1);

  if (organizacion.length === 0) {
    redirect("/dashboard/plataforma/organizaciones");
  }

  return (
    <>
      <SetBreadcrumbExtras
        extras={[{ label: organizacion[0].nombre }, { label: "Editar" }]}
      />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Editar organización</h1>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/plataforma/organizaciones">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <OrganizacionEditForm
            organizacionId={organizacion[0].id}
            identificadorCliente={organizacion[0].identificadorCliente}
            nombre={organizacion[0].nombre}
          />
        </div>
      </main>
    </>
  );
}
