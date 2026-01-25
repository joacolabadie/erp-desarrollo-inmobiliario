import { applicationRegistry } from "@/registry/applications";
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
