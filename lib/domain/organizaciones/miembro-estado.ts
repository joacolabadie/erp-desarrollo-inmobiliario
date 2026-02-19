export const MIEMBRO_ORGANIZACION_ESTADO_VALUES = [
  "activo",
  "suspendido",
] as const;

export type MiembroOrganizacionEstado =
  (typeof MIEMBRO_ORGANIZACION_ESTADO_VALUES)[number];

export const MIEMBRO_ORGANIZACION_ESTADO_LABELS = {
  activo: "Activo",
  suspendido: "Suspendido",
} as const satisfies Record<MiembroOrganizacionEstado, string>;
