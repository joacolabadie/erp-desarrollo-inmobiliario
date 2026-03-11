import {
  INVITACION_ORGANIZACION_ESTADO_VALUES,
  MATERIAL_TIPO_VALUES,
  MIEMBRO_ORGANIZACION_ESTADO_VALUES,
  MIEMBRO_ORGANIZACION_ROL_VALUES,
} from "@/lib/domain";
import { users } from "@/lib/server/db/schema/auth.generated";
import { aplicaciones } from "@/lib/server/db/schema/modulos";
import { proyectos } from "@/lib/server/db/schema/proyectos";
import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const miembroOrganizacionRolEnum = pgEnum(
  "miembro_organizacion_rol",
  MIEMBRO_ORGANIZACION_ROL_VALUES,
);

export const miembroOrganizacionEstadoEnum = pgEnum(
  "miembro_organizacion_estado",
  MIEMBRO_ORGANIZACION_ESTADO_VALUES,
);

export const invitacionOrganizacionEstadoEnum = pgEnum(
  "invitacion_organizacion_estado",
  INVITACION_ORGANIZACION_ESTADO_VALUES,
);

export const materialTipoEnum = pgEnum("material_tipo", MATERIAL_TIPO_VALUES);

export const organizaciones = pgTable(
  "organizaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    identificadorCliente: text("identificador_cliente").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [unique().on(t.identificadorCliente)],
);

export const organizacionesRazonesSociales = pgTable(
  "organizaciones_razones_sociales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    nombreLegal: text("nombre_legal").notNull(),
    cuit: text("cuit").notNull(),
  },
  (t) => [
    unique().on(t.organizacionId, t.id),
    unique().on(t.organizacionId, t.cuit),
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
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    codigo: text("codigo").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [
    unique().on(t.organizacionId, t.id),
    unique().on(t.organizacionId, t.codigo),
    unique().on(t.organizacionId, t.nombre),
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
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    nombre: text("nombre").notNull(),
    tipo: materialTipoEnum("tipo").notNull(),
    unidadMedidaId: uuid("unidad_medida_id").notNull(),
    stockeable: boolean("stockeable").default(true).notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.organizacionId, t.unidadMedidaId],
      foreignColumns: [unidadesMedida.organizacionId, unidadesMedida.id],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.nombre),
  ],
);

export const organizacionesAplicaciones = pgTable(
  "organizaciones_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    aplicacionId: uuid("aplicacion_id")
      .notNull()
      .references(() => aplicaciones.id, { onDelete: "restrict" }),
  },
  (t) => [unique().on(t.organizacionId, t.aplicacionId)],
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
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    rol: miembroOrganizacionRolEnum("rol").default("miembro").notNull(),
    estado: miembroOrganizacionEstadoEnum("estado").default("activo").notNull(),
  },
  (t) => [unique().on(t.organizacionId, t.usuarioId)],
);

export const organizacionesMiembrosAplicaciones = pgTable(
  "organizaciones_miembros_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    usuarioId: text("usuario_id").notNull(),
    aplicacionId: uuid("aplicacion_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: "manual_organizaciones_miembros_aplicaciones_organizacion_id_usuario_id_fkey",
      columns: [t.organizacionId, t.usuarioId],
      foreignColumns: [
        organizacionesMiembros.organizacionId,
        organizacionesMiembros.usuarioId,
      ],
    }).onDelete("restrict"),
    foreignKey({
      columns: [t.organizacionId, t.aplicacionId],
      foreignColumns: [
        organizacionesAplicaciones.organizacionId,
        organizacionesAplicaciones.aplicacionId,
      ],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.usuarioId, t.aplicacionId),
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
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    usuarioId: text("usuario_id").notNull(),
    proyectoId: uuid("proyecto_id").notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.organizacionId, t.usuarioId],
      foreignColumns: [
        organizacionesMiembros.organizacionId,
        organizacionesMiembros.usuarioId,
      ],
    }).onDelete("restrict"),
    foreignKey({
      columns: [t.organizacionId, t.proyectoId],
      foreignColumns: [proyectos.organizacionId, proyectos.id],
    }).onDelete("restrict"),
    unique().on(t.organizacionId, t.usuarioId, t.proyectoId),
  ],
);

export const organizacionesInvitaciones = pgTable(
  "organizaciones_invitaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "restrict" }),
    email: text("email").notNull(),
    rol: miembroOrganizacionRolEnum("rol").default("miembro").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
    estado: invitacionOrganizacionEstadoEnum("estado")
      .default("pendiente")
      .notNull(),
  },
  (t) => [
    unique().on(t.tokenHash),
    uniqueIndex()
      .on(t.organizacionId, t.email)
      .where(sql`${t.estado} = 'pendiente'`),
  ],
);
