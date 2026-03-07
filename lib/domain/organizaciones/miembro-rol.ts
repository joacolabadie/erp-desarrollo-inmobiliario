export const MIEMBRO_ORGANIZACION_ROL_VALUES = [
  "administrador",
  "miembro",
] as const;

export type MiembroOrganizacionRol =
  (typeof MIEMBRO_ORGANIZACION_ROL_VALUES)[number];

export const MIEMBRO_ORGANIZACION_ROL_LABELS = {
  administrador: "Administrador",
  miembro: "Miembro",
} as const satisfies Record<MiembroOrganizacionRol, string>;
