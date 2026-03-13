import {
  INVITACION_ORGANIZACION_ESTADO_VALUES,
  MATERIAL_TIPO_VALUES,
  MIEMBRO_ORGANIZACION_ESTADO_VALUES,
  MIEMBRO_ORGANIZACION_ROL_VALUES,
} from "@/lib/domain";
import { generateConstraintName } from "@/lib/server/db/constraint-names";
import { users } from "@/lib/server/db/schema/auth.generated";
import { aplicaciones } from "@/lib/server/db/schema/modulos";
import { proyectos } from "@/lib/server/db/schema/proyectos";
import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
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
    limiteProyectos: integer("limite_proyectos").notNull(),
  },
  (t) => [
    unique(
      generateConstraintName({
        table: "organizaciones",
        kind: "uq",
        parts: ["identificador_cliente"],
      }),
    ).on(t.identificadorCliente),
  ],
);

export const organizacionesRazonesSociales = pgTable(
  "organizaciones_razones_sociales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    nombreLegal: text("nombre_legal").notNull(),
    cuit: text("cuit").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_razones_sociales",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "organizaciones_razones_sociales",
        kind: "uq",
        parts: ["organizacion_id", "id"],
      }),
    ).on(t.organizacionId, t.id),
    unique(
      generateConstraintName({
        table: "organizaciones_razones_sociales",
        kind: "uq",
        parts: ["organizacion_id", "cuit"],
      }),
    ).on(t.organizacionId, t.cuit),
  ],
);

export const unidadesMedida = pgTable(
  "unidades_medida",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    codigo: text("codigo").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "unidades_medida",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "unidades_medida",
        kind: "uq",
        parts: ["organizacion_id", "id"],
      }),
    ).on(t.organizacionId, t.id),
    unique(
      generateConstraintName({
        table: "unidades_medida",
        kind: "uq",
        parts: ["organizacion_id", "codigo"],
      }),
    ).on(t.organizacionId, t.codigo),
    unique(
      generateConstraintName({
        table: "unidades_medida",
        kind: "uq",
        parts: ["organizacion_id", "nombre"],
      }),
    ).on(t.organizacionId, t.nombre),
  ],
);

export const materiales = pgTable(
  "materiales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    nombre: text("nombre").notNull(),
    tipo: materialTipoEnum("tipo").notNull(),
    unidadMedidaId: uuid("unidad_medida_id").notNull(),
    stockeable: boolean("stockeable").default(true).notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "materiales",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "materiales",
        kind: "fk",
        parts: [
          "organizacion_id",
          "unidad_medida_id",
          "unidades_medida",
          "organizacion_id",
          "id",
        ],
      }),
      columns: [t.organizacionId, t.unidadMedidaId],
      foreignColumns: [unidadesMedida.organizacionId, unidadesMedida.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "materiales",
        kind: "uq",
        parts: ["organizacion_id", "nombre"],
      }),
    ).on(t.organizacionId, t.nombre),
  ],
);

export const organizacionesAplicaciones = pgTable(
  "organizaciones_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    aplicacionId: uuid("aplicacion_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_aplicaciones",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_aplicaciones",
        kind: "fk",
        parts: ["aplicacion_id", "aplicaciones", "id"],
      }),
      columns: [t.aplicacionId],
      foreignColumns: [aplicaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "organizaciones_aplicaciones",
        kind: "uq",
        parts: ["organizacion_id", "aplicacion_id"],
      }),
    ).on(t.organizacionId, t.aplicacionId),
  ],
);

export const organizacionesMiembros = pgTable(
  "organizaciones_miembros",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    usuarioId: text("usuario_id").notNull(),
    rol: miembroOrganizacionRolEnum("rol").default("miembro").notNull(),
    estado: miembroOrganizacionEstadoEnum("estado").default("activo").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros",
        kind: "fk",
        parts: ["usuario_id", "users", "id"],
      }),
      columns: [t.usuarioId],
      foreignColumns: [users.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "organizaciones_miembros",
        kind: "uq",
        parts: ["organizacion_id", "usuario_id"],
      }),
    ).on(t.organizacionId, t.usuarioId),
  ],
);

export const organizacionesMiembrosAplicaciones = pgTable(
  "organizaciones_miembros_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    usuarioId: text("usuario_id").notNull(),
    aplicacionId: uuid("aplicacion_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_aplicaciones",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_aplicaciones",
        kind: "fk",
        parts: [
          "organizacion_id",
          "usuario_id",
          "organizaciones_miembros",
          "organizacion_id",
          "usuario_id",
        ],
      }),
      columns: [t.organizacionId, t.usuarioId],
      foreignColumns: [
        organizacionesMiembros.organizacionId,
        organizacionesMiembros.usuarioId,
      ],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_aplicaciones",
        kind: "fk",
        parts: [
          "organizacion_id",
          "aplicacion_id",
          "organizaciones_aplicaciones",
          "organizacion_id",
          "aplicacion_id",
        ],
      }),
      columns: [t.organizacionId, t.aplicacionId],
      foreignColumns: [
        organizacionesAplicaciones.organizacionId,
        organizacionesAplicaciones.aplicacionId,
      ],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "organizaciones_miembros_aplicaciones",
        kind: "uq",
        parts: ["organizacion_id", "usuario_id", "aplicacion_id"],
      }),
    ).on(t.organizacionId, t.usuarioId, t.aplicacionId),
  ],
);

export const organizacionesMiembrosProyectos = pgTable(
  "organizaciones_miembros_proyectos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    usuarioId: text("usuario_id").notNull(),
    proyectoId: uuid("proyecto_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_proyectos",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_proyectos",
        kind: "fk",
        parts: [
          "organizacion_id",
          "usuario_id",
          "organizaciones_miembros",
          "organizacion_id",
          "usuario_id",
        ],
      }),
      columns: [t.organizacionId, t.usuarioId],
      foreignColumns: [
        organizacionesMiembros.organizacionId,
        organizacionesMiembros.usuarioId,
      ],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_miembros_proyectos",
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
        table: "organizaciones_miembros_proyectos",
        kind: "uq",
        parts: ["organizacion_id", "usuario_id", "proyecto_id"],
      }),
    ).on(t.organizacionId, t.usuarioId, t.proyectoId),
  ],
);

export const organizacionesInvitaciones = pgTable(
  "organizaciones_invitaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizacionId: uuid("organizacion_id").notNull(),
    email: text("email").notNull(),
    rol: miembroOrganizacionRolEnum("rol").default("miembro").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
    estado: invitacionOrganizacionEstadoEnum("estado")
      .default("pendiente")
      .notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "organizaciones_invitaciones",
        kind: "fk",
        parts: ["organizacion_id", "organizaciones", "id"],
      }),
      columns: [t.organizacionId],
      foreignColumns: [organizaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "organizaciones_invitaciones",
        kind: "uq",
        parts: ["token_hash"],
      }),
    ).on(t.tokenHash),
    uniqueIndex(
      generateConstraintName({
        table: "organizaciones_invitaciones",
        kind: "uqx",
        parts: ["organizacion_id", "email", "estado_pendiente"],
      }),
    )
      .on(t.organizacionId, t.email)
      .where(sql`${t.estado} = 'pendiente'`),
  ],
);
