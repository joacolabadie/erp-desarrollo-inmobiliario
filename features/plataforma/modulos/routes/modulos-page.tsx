import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { modulosColumns } from "@/features/plataforma/modulos/routes/columns";
import { CreateModuloForm } from "@/features/plataforma/modulos/routes/create-modulo-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { modulos as modulosTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModulosPage() {
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

  const modulos = await db
    .select({
      id: modulosTabla.id,
      clave: modulosTabla.clave,
      slug: modulosTabla.slug,
      nombre: modulosTabla.nombre,
    })
    .from(modulosTabla)
    .where(eq(modulosTabla.activo, true))
    .orderBy(asc(modulosTabla.clave), asc(modulosTabla.id));

  return (
    <main className="px-4 py-12">
      <div className="container mx-auto space-y-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Módulos</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus />
                Crear módulo
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Crear módulo</SheetTitle>
                <SheetDescription>
                  Completá los datos para crear un nuevo módulo.
                </SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto px-4 pb-4">
                <CreateModuloForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <DataTable columns={modulosColumns} data={modulos} />
      </div>
    </main>
  );
}
