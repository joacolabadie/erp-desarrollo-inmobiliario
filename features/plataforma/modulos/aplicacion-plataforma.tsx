import CreateModuloPage from "@/features/plataforma/modulos/routes/create-modulo-page";
import EditModuloPage from "@/features/plataforma/modulos/routes/edit-modulo-page";
import ModuloAplicacionesPage from "@/features/plataforma/modulos/routes/modulo-aplicaciones-page";
import ModulosPage from "@/features/plataforma/modulos/routes/modulos-page";
import { auth } from "@/lib/auth";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { AplicacionPlataformaComponentProps } from "@/registry/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModulosAplicacionPlataforma({
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
    clave: "MODULOS",
  });

  if (!allowed) {
    redirect("/dashboard");
  }

  if (aplicacionPlataformaPath.length === 0) {
    return <ModulosPage />;
  }

  if (aplicacionPlataformaPath.length === 1) {
    if (aplicacionPlataformaPath[0] === "crear") {
      return <CreateModuloPage />;
    }
  }

  if (aplicacionPlataformaPath.length === 2) {
    if (aplicacionPlataformaPath[1] === "editar") {
      return <EditModuloPage moduloId={aplicacionPlataformaPath[0]} />;
    }

    if (aplicacionPlataformaPath[1] === "aplicaciones") {
      return <ModuloAplicacionesPage moduloId={aplicacionPlataformaPath[0]} />;
    }
  }

  redirect("/dashboard/plataforma/modulos");
}
