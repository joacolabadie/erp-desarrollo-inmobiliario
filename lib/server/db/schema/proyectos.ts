import { PROYECTO_ESTADO_VALUES, PROYECTO_TIPO_VALUES } from "@/lib/domain";
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
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    nombre: text("nombre").notNull(),
    tipo: proyectoTipoEnum("tipo").notNull(),
    estado: proyectoEstadoEnum("estado").default("planificacion").notNull(),
  },
  (t) => [
    unique().on(t.organizacionId, t.id),
    unique().on(t.organizacionId, t.nombre),
  ],
);

export const proyectosRazonesSociales = pgTable(
  "proyectos_razones_sociales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    proyectoId: uuid("proyecto_id").notNull(),
    organizacionRazonSocialId: uuid("organizacion_razon_social_id").notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    foreignKey({
      columns: [t.organizacionId, t.organizacionRazonSocialId],
      foreignColumns: [
        organizacionesRazonesSociales.organizacionId,
        organizacionesRazonesSociales.id,
      ],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.proyectoId, t.organizacionRazonSocialId),
  ],
);

export const proyectosRubros = pgTable(
  "proyectos_rubros",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    proyectoId: uuid("proyecto_id").notNull(),
    nombre: text("nombre").notNull(),
    orden: integer("orden").notNull().default(0),
  },
  (t) => [
    foreignKey({
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.proyectoId, t.id),
    unique().on(t.organizacionId, t.proyectoId, t.nombre),
  ],
);

export const proyectosCategorias = pgTable(
  "proyectos_categorias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    proyectoId: uuid("proyecto_id").notNull(),
    rubroId: uuid("rubro_id").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    foreignKey({
      columns: [t.organizacionId, t.proyectoId, t.rubroId],
      foreignColumns: [
        proyectosRubros.organizacionId,
        proyectosRubros.proyectoId,
        proyectosRubros.id,
      ],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.proyectoId, t.nombre),
  ],
);
