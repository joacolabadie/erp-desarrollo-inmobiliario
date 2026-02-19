export const PROYECTO_ESTADO_VALUES = [
  "cancelado",
  "en_construccion",
  "finalizado",
  "planificacion",
] as const;

export type ProyectoEstado = (typeof PROYECTO_ESTADO_VALUES)[number];

export const PROYECTO_ESTADO_LABELS = {
  cancelado: "Cancelado",
  en_construccion: "En construcción",
  finalizado: "Finalizado",
  planificacion: "Planificación",
} as const satisfies Record<ProyectoEstado, string>;
