import { auth } from "@/lib/auth";
import { aplicacionPlataformaRegistry } from "@/registry/aplicacion-plataforma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AplicacionPlataformaSubroutePage({
  params,
}: {
  params: Promise<{
    aplicacionPlataformaSlug: string;
    aplicacionPlataformaPath: string[];
  }>;
}) {
  const { aplicacionPlataformaSlug, aplicacionPlataformaPath } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const aplicacionPlataformaDefinition =
    aplicacionPlataformaRegistry[aplicacionPlataformaSlug];

  if (!aplicacionPlataformaDefinition) {
    redirect("/dashboard");
  }

  const Component = aplicacionPlataformaDefinition.component;

  return <Component aplicacionPlataformaPath={aplicacionPlataformaPath} />;
}
