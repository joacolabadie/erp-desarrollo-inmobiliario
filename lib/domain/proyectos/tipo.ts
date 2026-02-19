export const PROYECTO_TIPO_VALUES = ["casa", "cocheras", "edificio"] as const;

export type ProyectoTipo = (typeof PROYECTO_TIPO_VALUES)[number];

export const PROYECTO_TIPO_LABELS = {
  casa: "Casa",
  cocheras: "Cocheras",
  edificio: "Edificio",
} as const satisfies Record<ProyectoTipo, string>;
