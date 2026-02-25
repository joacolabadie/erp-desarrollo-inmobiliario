import { DataTable } from "@/components/ui/data-table";
import { modulosColumns } from "@/features/plataforma/modulos/routes/columns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { modulos as modulosTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { asc, eq } from "drizzle-orm";
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
        <h1 className="text-2xl font-semibold">Módulos</h1>
        <DataTable
          columns={modulosColumns}
          data={modulos}
          search={{
            placeholder: "Buscar módulo...",
            columns: ["clave", "slug", "nombre"],
          }}
          action={{
            label: "Crear módulo",
            href: "/dashboard/plataforma/modulos/crear",
            iconName: "plus",
          }}
        />
      </div>
    </main>
  );
}
