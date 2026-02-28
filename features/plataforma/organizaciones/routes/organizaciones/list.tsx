import { OrganizacionesTable } from "@/features/plataforma/organizaciones/routes/organizaciones/components/table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { organizaciones as organizacionesTabla } from "@/lib/server/db/schema";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizacionesList() {
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
      <div className="container mx-auto space-y-12">
        <h1 className="text-2xl font-semibold">Organizaciones</h1>
        <OrganizacionesTable organizaciones={organizaciones} />
      </div>
    </main>
  );
}
