import { resend } from "@/lib/server/email/resend";

type SendOrganizacionInvitacionEmailArgs = {
  to: string;
  inviteUrl: string;
  organizacionId: string;
  rol: string;
};

export async function sendOrganizacionInvitacionEmail({
  to,
  inviteUrl,
  organizacionId,
  rol,
}: SendOrganizacionInvitacionEmailArgs) {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable");
  }

  const subject = "Invitacion a organizacion";
  const text = [
    "Recibiste una invitacion para sumarte a una organizacion.",
    `Organizacion: ${organizacionId}`,
    `Rol: ${rol}`,
    `Aceptar invitacion: ${inviteUrl}`,
  ].join("\n");

  const html = [
    "<p>Recibiste una invitacion para sumarte a una organizacion.</p>",
    `<p><strong>Organizacion:</strong> ${organizacionId}</p>`,
    `<p><strong>Rol:</strong> ${rol}</p>`,
    `<p><a href="${inviteUrl}">Aceptar invitacion</a></p>`,
  ].join("");

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(
      `SEND_ORGANIZACION_INVITACION_EMAIL_ERROR: ${error.message}`,
    );
  }
}
