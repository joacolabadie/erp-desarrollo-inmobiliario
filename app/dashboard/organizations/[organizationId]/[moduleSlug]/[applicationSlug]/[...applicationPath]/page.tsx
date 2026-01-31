import { auth } from "@/lib/auth";
import { applicationRegistry } from "@/registry/applications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizationApplicationSubroutePage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    moduleSlug: string;
    applicationSlug: string;
    applicationPath: string[];
  }>;
}) {
  const { organizationId, moduleSlug, applicationSlug, applicationPath } =
    await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const moduleRegistry = applicationRegistry[moduleSlug];
  const applicationDefinition = moduleRegistry?.[applicationSlug];

  if (!applicationDefinition) {
    redirect(`/dashboard/organizations/${organizationId}`);
  }

  const Component = applicationDefinition.component;

  return (
    <Component
      organizationId={organizationId}
      projectId={null}
      applicationPath={applicationPath}
    />
  );
}
