import AplicacionesList from "@/features/plataforma/modulos/routes/aplicaciones/aplicaciones-list";
import ModulosList from "@/features/plataforma/modulos/routes/modulos/modulos-list";
import { auth } from "@/lib/auth";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import type { AplicacionPlataformaComponentProps } from "@/registry/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModulosEntry({
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
    return <ModulosList />;
  }

  if (aplicacionPlataformaPath.length === 2) {
    if (aplicacionPlataformaPath[1] === "aplicaciones") {
      return <AplicacionesList moduloId={aplicacionPlataformaPath[0]} />;
    }
  }

  redirect("/dashboard/plataforma/modulos");
}
