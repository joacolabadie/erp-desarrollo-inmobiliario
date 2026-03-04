export const INVITACION_ORGANIZACION_ESTADO_VALUES = [
  "pendiente",
  "aceptada",
  "revocada",
  "expirada",
] as const;

export type InvitacionOrganizacionEstado =
  (typeof INVITACION_ORGANIZACION_ESTADO_VALUES)[number];

export const INVITACION_ORGANIZACION_ESTADO_LABELS = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  revocada: "Revocada",
  expirada: "Expirada",
} as const satisfies Record<InvitacionOrganizacionEstado, string>;
