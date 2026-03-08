export const INVITACION_ORGANIZACION_ESTADO_VALUES = [
  "aceptada",
  "expirada",
  "pendiente",
  "revocada",
] as const;

export type InvitacionOrganizacionEstado =
  (typeof INVITACION_ORGANIZACION_ESTADO_VALUES)[number];

export const INVITACION_ORGANIZACION_ESTADO_LABELS = {
  aceptada: "Aceptada",
  expirada: "Expirada",
  pendiente: "Pendiente",
  revocada: "Revocada",
} as const satisfies Record<InvitacionOrganizacionEstado, string>;
