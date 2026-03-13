import { PROYECTO_ESTADO_VALUES, PROYECTO_TIPO_VALUES } from "@/lib/domain";
import { generateConstraintName } from "@/lib/server/db/constraint-names";
import {
  organizaciones,
  organizacionesRazonesSociales,
} from "@/lib/server/db/schema/organizaciones";
import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const proyectoTipoEnum = pgEnum("proyecto_tipo", PROYECTO_TIPO_VALUES);

export const proyectoEstadoEnum = pgEnum(
  "proyecto_estado",
  PROYECTO_ESTADO_VALUES,
);

export const proyectos = pgTable(
  "proyectos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    nombre: text("nombre").notNull(),
    tipo: proyectoTipoEnum("tipo").notNull(),
    estado: proyectoEstadoEnum("estado").default("planificacion").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "proyectos",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "proyectos",
        kind: "uq",
        parts: ["organizacion_id", "id"],
      }),
    ).on(t.organizacionId, t.id),
    unique(
      generateConstraintName({
        table: "proyectos",
        kind: "uq",
        parts: ["organizacion_id", "nombre"],
      }),
    ).on(t.organizacionId, t.nombre),
  ],
);

export const proyectosRazonesSociales = pgTable(
  "proyectos_razones_sociales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    proyectoId: uuid("proyecto_id").notNull(),
    organizacionRazonSocialId: uuid("organizacion_razon_social_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_razones_sociales",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_razones_sociales",
        kind: "fk",
        parts: [
          "organizacion_id",
          "proyecto_id",
          "proyectos",
          "organizacion_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_razones_sociales",
        kind: "fk",
        parts: [
          "organizacion_id",
          "organizacion_razon_social_id",
          "organizaciones_razones_sociales",
          "organizacion_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.organizacionRazonSocialId],
      foreignColumns: [
        organizacionesRazonesSociales.organizacionId,
        organizacionesRazonesSociales.id,
      ],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "proyectos_razones_sociales",
        kind: "uq",
        parts: [
          "organizacion_id",
          "proyecto_id",
          "organizacion_razon_social_id",
        ],
      }),
    ).on(t.organizacionId, t.proyectoId, t.organizacionRazonSocialId),
  ],
);

export const proyectosRubros = pgTable(
  "proyectos_rubros",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    proyectoId: uuid("proyecto_id").notNull(),
    nombre: text("nombre").notNull(),
    orden: integer("orden").notNull().default(0),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_rubros",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_rubros",
        kind: "fk",
        parts: [
          "organizacion_id",
          "proyecto_id",
          "proyectos",
          "organizacion_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "proyectos_rubros",
        kind: "uq",
        parts: ["organizacion_id", "proyecto_id", "id"],
      }),
    ).on(t.organizacionId, t.proyectoId, t.id),
    unique(
      generateConstraintName({
        table: "proyectos_rubros",
        kind: "uq",
        parts: ["organizacion_id", "proyecto_id", "nombre"],
      }),
    ).on(t.organizacionId, t.proyectoId, t.nombre),
  ],
);

export const proyectosCategorias = pgTable(
  "proyectos_categorias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    proyectoId: uuid("proyecto_id").notNull(),
    rubroId: uuid("rubro_id").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_categorias",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_categorias",
        kind: "fk",
        parts: [
          "organizacion_id",
          "proyecto_id",
          "proyectos",
          "organizacion_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "proyectos_categorias",
        kind: "fk",
        parts: [
          "organizacion_id",
          "proyecto_id",
          "rubro_id",
          "proyectos_rubros",
          "organizacion_id",
          "proyecto_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.proyectoId, t.rubroId],
      foreignColumns: [
        proyectosRubros.organizacionId,
        proyectosRubros.proyectoId,
        proyectosRubros.id,
      ],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "proyectos_categorias",
        kind: "uq",
        parts: ["organizacion_id", "proyecto_id", "nombre"],
      }),
    ).on(t.organizacionId, t.proyectoId, t.nombre),
  ],
);
