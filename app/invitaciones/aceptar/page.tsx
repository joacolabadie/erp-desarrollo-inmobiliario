import { AcceptInvitacionClient } from "@/app/invitaciones/aceptar/accept-invitacion-client";

export default async function AcceptInvitacionPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  const { token } = await searchParams;

  return <AcceptInvitacionClient token={token ?? null} />;
}
