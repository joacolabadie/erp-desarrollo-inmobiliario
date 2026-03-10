import { AceptarInvitacionClient } from "@/app/invitaciones/aceptar/aceptar-invitacion-client";

export default async function AceptarInvitacionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <AceptarInvitacionClient token={token ?? null} />;
}
