import { auth } from "@/lib/auth";
import { aplicacionRegistry } from "@/registry/aplicaciones";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizacionAplicacionPage({
  params,
}: {
  params: Promise<{
    organizacionId: string;
    moduloSlug: string;
    aplicacionSlug: string;
  }>;
}) {
  const { organizacionId, moduloSlug, aplicacionSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const moduloRegistry = aplicacionRegistry[moduloSlug];
  const aplicacionDefinition = moduloRegistry?.[aplicacionSlug];

  if (!aplicacionDefinition) {
    redirect(`/dashboard/organizaciones/${organizacionId}`);
  }

  const Component = aplicacionDefinition.component;

  return (
    <Component
      organizacionId={organizacionId}
      proyectoId={null}
      aplicacionPath={[]}
    />
  );
}
