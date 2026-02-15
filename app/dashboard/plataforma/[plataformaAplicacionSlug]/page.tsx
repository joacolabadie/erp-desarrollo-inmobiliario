import { auth } from "@/lib/auth";
import { plataformaAplicacionRegistry } from "@/registry/plataforma-aplicacion";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PlataformaAplicacionPage({
  params,
}: {
  params: Promise<{
    plataformaAplicacionSlug: string;
  }>;
}) {
  const { plataformaAplicacionSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const aplicacionDefinition =
    plataformaAplicacionRegistry[plataformaAplicacionSlug];

  if (!aplicacionDefinition) {
    redirect("/dashboard");
  }

  const Component = aplicacionDefinition.component;

  return <Component plataformaAplicacionPath={[]} />;
}
