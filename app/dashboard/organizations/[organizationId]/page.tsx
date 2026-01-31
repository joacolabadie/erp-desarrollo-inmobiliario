import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="h-full bg-[radial-gradient(var(--color-sidebar-border)_1px,transparent_1px)] bg-size-[16px_16px]" />
  );
}
