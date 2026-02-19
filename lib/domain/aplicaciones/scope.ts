export const APLICACION_SCOPE_VALUES = [
  "mixto",
  "organizacional",
  "proyecto",
] as const;

export type AplicacionScope = (typeof APLICACION_SCOPE_VALUES)[number];

export const APLICACION_SCOPE_LABELS = {
  mixto: "Mixto",
  organizacional: "Organizacional",
  proyecto: "Proyecto",
} as const satisfies Record<AplicacionScope, string>;
