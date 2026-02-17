import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { organizacionesColumns } from "@/features/plataforma/organizaciones/routes/columns";
import { CrearOrganizacionForm } from "@/features/plataforma/organizaciones/routes/crear-organizacion-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones as organizacionesTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizacionesPage() {
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

  const organizaciones = await db
    .select({
      id: organizacionesTabla.id,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesTabla)
    .where(eq(organizacionesTabla.activo, true))
    .orderBy(asc(organizacionesTabla.nombre), asc(organizacionesTabla.id));

  return (
    <main className="px-4 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Organizaciones</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus />
                Crear organización
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Crear organización</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-4 pb-4">
                <CrearOrganizacionForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <DataTable columns={organizacionesColumns} data={organizaciones} />
      </div>
    </main>
  );
}
