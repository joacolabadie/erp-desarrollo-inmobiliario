import { InvitacionLoader } from "@/app/invitaciones/aceptar/invitacion-loader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AcceptInvitacionPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/auth/sign-in");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const next = `/invitaciones/aceptar?token=${encodeURIComponent(token)}`;

    redirect(`/auth/sign-in?next=${encodeURIComponent(next)}`);
  }

  return <InvitacionLoader token={token} />;
}
