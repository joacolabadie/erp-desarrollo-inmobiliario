import {
  MIEMBRO_ORGANIZACION_ROL_LABELS,
  type MiembroOrganizacionRol,
} from "@/lib/domain";
import { resend } from "@/lib/server/email/resend";

type SendInvitacionEmailArgs = {
  to: string;
  invitacionUrl: string;
  organizacionNombre: string;
  rol: MiembroOrganizacionRol;
};

export async function sendInvitacionEmail({
  to,
  invitacionUrl,
  organizacionNombre,
  rol,
}: SendInvitacionEmailArgs) {
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
    invitacionUrl,
  ].join("\n");

  const html = [
    `<p>Recibiste una invitación para sumarte a la organización <strong>${organizacionNombre}</strong>.</p>`,
    `<p>Tu rol asignado es <strong>${rolLabel}</strong>.</p>`,
    "<p>Para aceptar la invitación, entrá a este enlace:</p>",
    `<p><a href="${invitacionUrl}">Aceptar invitación</a></p>`,
  ].join("");

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error("No se pudo enviar la invitación.");
  }
}
