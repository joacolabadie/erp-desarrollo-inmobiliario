import {
  MIEMBRO_ORGANIZACION_ROL_LABELS,
  type MiembroOrganizacionRol,
} from "@/lib/domain";
import { resend } from "@/lib/server/email/resend";

type SendOrganizacionInvitacionEmailArgs = {
  to: string;
  inviteUrl: string;
  organizacionNombre: string;
  rol: MiembroOrganizacionRol;
};

export async function sendOrganizacionInvitacionEmail({
  to,
  inviteUrl,
  organizacionNombre,
  rol,
}: SendOrganizacionInvitacionEmailArgs) {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable");
  }

  const subject = `Invitación para sumarte a ${organizacionNombre}`;

  const rolLabel = MIEMBRO_ORGANIZACION_ROL_LABELS[rol];

  const text = [
    `Recibiste una invitación para sumarte a la organización ${organizacionNombre}.`,
    `Tu rol asignado es ${rolLabel}.`,
    "Para aceptar la invitación, entrá a este enlace:",
    inviteUrl,
  ].join("\n");

  const html = [
    `<p>Recibiste una invitación para sumarte a la organización <strong>${organizacionNombre}</strong>.</p>`,
    `<p>Tu rol asignado es <strong>${rolLabel}</strong>.</p>`,
    "<p>Para aceptar la invitación, entrá a este enlace:</p>",
    `<p><a href="${inviteUrl}">Aceptar invitación</a></p>`,
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
