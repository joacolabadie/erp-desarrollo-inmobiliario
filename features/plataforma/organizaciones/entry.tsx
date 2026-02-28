import AplicacionesPage from "@/features/plataforma/organizaciones/routes/aplicaciones/list";
import ModulosPage from "@/features/plataforma/organizaciones/routes/modulos/list";
import CreateOrganizacionPage from "@/features/plataforma/organizaciones/routes/organizaciones/create";
import EditOrganizacionPage from "@/features/plataforma/organizaciones/routes/organizaciones/edit";
import OrganizacionesPage from "@/features/plataforma/organizaciones/routes/organizaciones/list";
import { auth } from "@/lib/auth";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import type { AplicacionPlataformaComponentProps } from "@/registry/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizacionesEntry({
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

    if (aplicacionPlataformaPath[1] === "modulos") {
      return <ModulosPage organizacionId={aplicacionPlataformaPath[0]} />;
    }
  }

  if (aplicacionPlataformaPath.length === 4) {
    if (
      aplicacionPlataformaPath[1] === "modulos" &&
      aplicacionPlataformaPath[3] === "aplicaciones"
    ) {
      return (
        <AplicacionesPage
          organizacionId={aplicacionPlataformaPath[0]}
          moduloId={aplicacionPlataformaPath[2]}
        />
      );
    }
  }

  redirect("/dashboard/plataforma/organizaciones");
}
