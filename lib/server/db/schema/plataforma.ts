import { generateConstraintName } from "@/lib/server/db/constraint-names";
import { users } from "@/lib/server/db/schema/auth.generated";
import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const plataformaAdministradores = pgTable(
  "plataforma_administradores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    usuarioId: text("usuario_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "plataforma_administradores",
        kind: "fk",
        parts: ["usuario_id", "users", "id"],
      }),
      columns: [t.usuarioId],
      foreignColumns: [users.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "plataforma_administradores",
        kind: "uq",
        parts: ["usuario_id"],
      }),
    ).on(t.usuarioId),
  ],
);

export const plataformaAplicaciones = pgTable(
  "plataforma_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    clave: text("clave").notNull(),
    slug: text("slug").notNull(),
    nombre: text("nombre").notNull(),
  },
  (t) => [
    unique(
      generateConstraintName({
        table: "plataforma_aplicaciones",
        kind: "uq",
        parts: ["clave"],
      }),
    ).on(t.clave),
    unique(
      generateConstraintName({
        table: "plataforma_aplicaciones",
        kind: "uq",
        parts: ["slug"],
      }),
    ).on(t.slug),
  ],
);

export const plataformaAdministradoresAplicaciones = pgTable(
  "plataforma_administradores_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    plataformaAdministradorId: uuid("plataforma_administrador_id").notNull(),
    plataformaAplicacionId: uuid("plataforma_aplicacion_id").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "plataforma_administradores_aplicaciones",
        kind: "fk",
        parts: [
          "plataforma_administrador_id",
          "plataforma_administradores",
          "id",
        ],
      }),
      columns: [t.plataformaAdministradorId],
      foreignColumns: [plataformaAdministradores.id],
    }).onDelete("restrict"),
    foreignKey({
      name: generateConstraintName({
        table: "plataforma_administradores_aplicaciones",
        kind: "fk",
        parts: ["plataforma_aplicacion_id", "plataforma_aplicaciones", "id"],
      }),
      columns: [t.plataformaAplicacionId],
      foreignColumns: [plataformaAplicaciones.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "plataforma_administradores_aplicaciones",
        kind: "uq",
        parts: ["plataforma_administrador_id", "plataforma_aplicacion_id"],
      }),
    ).on(t.plataformaAdministradorId, t.plataformaAplicacionId),
  ],
);
