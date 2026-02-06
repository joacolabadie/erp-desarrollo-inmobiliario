import { auth } from "@/lib/auth";
import { platformApplicationRegistry } from "@/registry/platform-applications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PlatformApplicationSubroutePage({
  params,
}: {
  params: Promise<{
    platformApplicationSlug: string;
    platformApplicationPath: string[];
  }>;
}) {
  const { platformApplicationSlug, platformApplicationPath } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const applicationDefinition =
    platformApplicationRegistry[platformApplicationSlug];

  if (!applicationDefinition) {
    redirect("/dashboard");
  }

  const Component = applicationDefinition.component;

  return <Component platformApplicationPath={platformApplicationPath} />;
}
