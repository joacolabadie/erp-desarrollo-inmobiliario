import { sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth.generated";
import { modulos } from "./modulos";
import { proyectos } from "./proyectos";

export const estadoMiembroOrganizacionEnum = pgEnum("estado_miembro_org", [
  "activo",
  "suspendido",
]);

export const materialTipoEnum = pgEnum("material_tipo", [
  "material",
  "mano_obra",
]);

export const organizaciones = pgTable("organizaciones", {
  id: uuid("id").defaultRandom().primaryKey(),
  creadoEn: timestamp("creado_en", { withTimezone: true })
    .defaultNow()
    .notNull(),
  nombre: text("nombre").notNull(),
  activo: boolean("activo").default(true).notNull(),
});

export const organizacionesRazonesSociales = pgTable(
  "organizaciones_razones_sociales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    nombreLegal: text("nombre_legal").notNull(),
    cuit: text("cuit").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "organizaciones_razones_sociales_organizacion_id_cuit_key_active",
    )
      .on(t.organizacionId, t.cuit)
      .where(sql`${t.activo} = true`),
  ],
);

export const unidadesMedida = pgTable(
  "unidades_medida",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    codigo: text("codigo").notNull(),
    nombre: text("nombre").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("unidades_medida_organizacion_id_codigo_key_active")
      .on(t.organizacionId, t.codigo)
      .where(sql`${t.activo} = true`),
    uniqueIndex("unidades_medida_organizacion_id_nombre_key_active")
      .on(t.organizacionId, t.nombre)
      .where(sql`${t.activo} = true`),
  ],
);

export const materiales = pgTable(
  "materiales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    tipo: materialTipoEnum("tipo").notNull(),
    unidadMedidaId: uuid("unidad_medida_id")
      .notNull()
      .references(() => unidadesMedida.id, { onDelete: "restrict" }),
    stockeable: boolean("stockeable").default(false).notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("materiales_organizacion_id_nombre_key_active")
      .on(t.organizacionId, t.nombre)
      .where(sql`${t.activo} = true`),
  ],
);

export const organizacionesModulos = pgTable(
  "organizaciones_modulos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    moduloId: uuid("modulo_id")
      .notNull()
      .references(() => modulos.id, { onDelete: "restrict" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("organizaciones_modulos_organizacion_id_modulo_id_key_active")
      .on(t.organizacionId, t.moduloId)
      .where(sql`${t.activo} = true`),
  ],
);

export const organizacionesMiembros = pgTable(
  "organizaciones_miembros",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    estado: estadoMiembroOrganizacionEnum("estado").default("activo").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("organizaciones_miembros_organizacion_id_usuario_id_key_active")
      .on(t.organizacionId, t.usuarioId)
      .where(sql`${t.activo} = true`),
  ],
);

export const organizacionesMiembrosModulos = pgTable(
  "organizaciones_miembros_modulos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    moduloId: uuid("modulo_id")
      .notNull()
      .references(() => modulos.id, { onDelete: "restrict" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "organizaciones_miembros_modulos_organizacion_id_usuario_id_modulo_id_key_active",
    )
      .on(t.organizacionId, t.usuarioId, t.moduloId)
      .where(sql`${t.activo} = true`),
  ],
);

export const organizacionesMiembrosProyectos = pgTable(
  "organizaciones_miembros_proyectos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    proyectoId: uuid("proyecto_id")
      .notNull()
      .references(() => proyectos.id, { onDelete: "cascade" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "organizaciones_miembros_proyectos_organizacion_id_usuario_id_proyecto_id_key_active",
    )
      .on(t.organizacionId, t.usuarioId, t.proyectoId)
      .where(sql`${t.activo} = true`),
  ],
);
