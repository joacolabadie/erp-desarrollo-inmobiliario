import { auth } from "@/lib/auth";
import { applicationRegistry } from "@/registry/applications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizationApplicationPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    moduleSlug: string;
    applicationSlug: string;
  }>;
}) {
  const { organizationId, moduleSlug, applicationSlug } = await params;

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
    redirect(`/dashboard/organizations/${organizationId}`);
  }

  const Component = applicationDefinition.component;

  return <Component organizationId={organizationId} projectId={null} />;
}
