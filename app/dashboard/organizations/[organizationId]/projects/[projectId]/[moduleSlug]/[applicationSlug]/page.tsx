import { auth } from "@/lib/auth";
import { applicationRegistry } from "@/registry/applications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectApplicationPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    projectId: string;
    moduleSlug: string;
    applicationSlug: string;
  }>;
}) {
  const { organizationId, projectId, moduleSlug, applicationSlug } =
    await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const moduleRegistry =
    applicationRegistry[moduleSlug as keyof typeof applicationRegistry];
  const applicationDefinition =
    moduleRegistry?.[applicationSlug as keyof typeof moduleRegistry];

  if (!applicationDefinition) {
    redirect(
      `/dashboard/organizations/${organizationId}/projects/${projectId}`,
    );
  }

  const Component = applicationDefinition.component;

  return <Component organizationId={organizationId} projectId={projectId} />;
}
