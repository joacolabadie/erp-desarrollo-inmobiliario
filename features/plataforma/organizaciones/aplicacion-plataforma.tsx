import CreateOrganizacionPage from "@/features/plataforma/organizaciones/routes/create-organizacion-page";
import EditOrganizacionPage from "@/features/plataforma/organizaciones/routes/edit-organizacion-page";
import OrganizacionesPage from "@/features/plataforma/organizaciones/routes/organizaciones-page";
import { auth } from "@/lib/auth";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { AplicacionPlataformaComponentProps } from "@/registry/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizacionesAplicacionPlataforma({
  aplicacionPlataformaPath,
}: AplicacionPlataformaComponentProps) {
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

  if (aplicacionPlataformaPath.length === 0) {
    return <OrganizacionesPage />;
  }

  if (aplicacionPlataformaPath.length === 1) {
    if (aplicacionPlataformaPath[0] === "crear") {
      return <CreateOrganizacionPage />;
    }
  }

  if (aplicacionPlataformaPath.length === 2) {
    if (aplicacionPlataformaPath[1] === "editar") {
      return (
        <EditOrganizacionPage organizacionId={aplicacionPlataformaPath[0]} />
      );
    }
  }

  redirect("/dashboard/plataforma/organizaciones");
}
