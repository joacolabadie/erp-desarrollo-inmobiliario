export const MATERIAL_TIPO_VALUES = ["mano_obra", "material"] as const;

export type MaterialTipo = (typeof MATERIAL_TIPO_VALUES)[number];

export const MATERIAL_TIPO_LABELS = {
  mano_obra: "Mano de obra",
  material: "Material",
} as const satisfies Record<MaterialTipo, string>;
