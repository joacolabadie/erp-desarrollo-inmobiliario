import { PROYECTO_ESTADO_VALUES } from "@/lib/domain/proyectos/estado";
import { PROYECTO_TIPO_VALUES } from "@/lib/domain/proyectos/tipo";
import {
  organizaciones,
  organizacionesRazonesSociales,
} from "@/lib/server/db/schema/organizaciones";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    tipo: proyectoTipoEnum("tipo").notNull(),
    estado: proyectoEstadoEnum("estado").default("planificacion").notNull(),
    organizacionRazonSocialPrincipalId: uuid(
      "organizacion_razon_social_principal_id",
    ).references(() => organizacionesRazonesSociales.id, {
      onDelete: "restrict",
    }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("proyectos_organizacion_id_nombre_key_active")
      .on(t.organizacionId, t.nombre)
      .where(sql`${t.activo} = true`),
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
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    proyectoId: uuid("proyecto_id")
      .notNull()
      .references(() => proyectos.id, { onDelete: "cascade" }),
    organizacionRazonSocialId: uuid("organizacion_razon_social_id")
      .notNull()
      .references(() => organizacionesRazonesSociales.id, {
        onDelete: "restrict",
      }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "proyectos_razones_sociales_proyecto_id_organizacion_razon_social_id_key_active",
    )
      .on(t.proyectoId, t.organizacionRazonSocialId)
      .where(sql`${t.activo} = true`),
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
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    proyectoId: uuid("proyecto_id")
      .notNull()
      .references(() => proyectos.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    orden: integer("orden").notNull().default(0),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("proyectos_rubros_proyecto_id_nombre_key_active")
      .on(t.proyectoId, t.nombre)
      .where(sql`${t.activo} = true`),
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
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    proyectoId: uuid("proyecto_id")
      .notNull()
      .references(() => proyectos.id, { onDelete: "cascade" }),
    rubroId: uuid("rubro_id")
      .notNull()
      .references(() => proyectosRubros.id, { onDelete: "restrict" }),
    nombre: text("nombre").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("proyectos_categorias_proyecto_id_nombre_key_active")
      .on(t.proyectoId, t.nombre)
      .where(sql`${t.activo} = true`),
  ],
);
