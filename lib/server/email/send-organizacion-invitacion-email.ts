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

  const subject = "Invitacion a organizacion";
  const rolLabel = MIEMBRO_ORGANIZACION_ROL_LABELS[rol];
  const text = [
    "Recibiste una invitacion para sumarte a una organizacion.",
    `Organizacion: ${organizacionNombre}`,
    `Rol: ${rolLabel}`,
    `Aceptar invitacion: ${inviteUrl}`,
  ].join("\n");

  const html = [
    "<p>Recibiste una invitacion para sumarte a una organizacion.</p>",
    `<p><strong>Organizacion:</strong> ${organizacionNombre}</p>`,
    `<p><strong>Rol:</strong> ${rolLabel}</p>`,
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
