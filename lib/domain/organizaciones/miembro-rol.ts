export const MIEMBRO_ORGANIZACION_ROL_VALUES = ["dueno", "miembro"] as const;

export type MiembroOrganizacionRol =
  (typeof MIEMBRO_ORGANIZACION_ROL_VALUES)[number];

export const MIEMBRO_ORGANIZACION_ROL_LABELS = {
  dueno: "Dueño",
  miembro: "Miembro",
} as const satisfies Record<MiembroOrganizacionRol, string>;
