import { AceptarInvitacionClient } from "@/app/invitaciones/aceptar/page-client";

type AceptarInvitacionPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function AceptarInvitacionPage({
  searchParams,
}: AceptarInvitacionPageProps) {
  const params = await searchParams;
  const tokenParam = params.token;
  const token = typeof tokenParam === "string" ? tokenParam : null;

  return <AceptarInvitacionClient token={token} />;
}
