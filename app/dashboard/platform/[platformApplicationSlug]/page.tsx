import { platformApplicationRegistry } from "@/registry/platform-applications";
import { redirect } from "next/navigation";

export default async function PlatformApplicationPage({
  params,
}: {
  params: Promise<{
    platformApplicationSlug: string;
  }>;
}) {
  const { platformApplicationSlug } = await params;

  const applicationDefinition =
    platformApplicationRegistry[
      platformApplicationSlug as keyof typeof platformApplicationRegistry
    ];

  if (!applicationDefinition) {
    redirect("/dashboard");
  }

  const Component = applicationDefinition.component;

  return <Component />;
}
