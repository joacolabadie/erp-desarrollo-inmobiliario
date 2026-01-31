import { auth } from "@/lib/auth";
import { applicationRegistry } from "@/registry/applications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectApplicationSubroutePage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    projectId: string;
    moduleSlug: string;
    applicationSlug: string;
    applicationPath: string[];
  }>;
}) {
  const {
    organizationId,
    projectId,
    moduleSlug,
    applicationSlug,
    applicationPath,
  } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const moduleRegistry = applicationRegistry[moduleSlug];
  const applicationDefinition = moduleRegistry?.[applicationSlug];

  if (!applicationDefinition) {
    redirect(
      `/dashboard/organizations/${organizationId}/projects/${projectId}`,
    );
  }

  const Component = applicationDefinition.component;

  return (
    <Component
      organizationId={organizationId}
      projectId={projectId}
      applicationPath={applicationPath}
    />
  );
}
