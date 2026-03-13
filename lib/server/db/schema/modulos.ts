import { APLICACION_SCOPE_VALUES } from "@/lib/domain";
import { generateConstraintName } from "@/lib/server/db/constraint-names";
import {
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const aplicacionScopeEnum = pgEnum(
  "aplicacion_scope",
  APLICACION_SCOPE_VALUES,
);

export const modulos = pgTable(
  "modulos",
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
        table: "modulos",
        kind: "uq",
        parts: ["clave"],
      }),
    ).on(t.clave),
    unique(
      generateConstraintName({
        table: "modulos",
        kind: "uq",
        parts: ["slug"],
      }),
    ).on(t.slug),
  ],
);

export const aplicaciones = pgTable(
  "aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    moduloId: uuid("modulo_id").notNull(),
    clave: text("clave").notNull(),
    slug: text("slug").notNull(),
    nombre: text("nombre").notNull(),
    scope: aplicacionScopeEnum("scope").notNull(),
  },
  (t) => [
    foreignKey({
      name: generateConstraintName({
        table: "aplicaciones",
        kind: "fk",
        parts: ["modulo_id", "modulos", "id"],
      }),
      columns: [t.moduloId],
      foreignColumns: [modulos.id],
    }).onDelete("restrict"),
    unique(
      generateConstraintName({
        table: "aplicaciones",
        kind: "uq",
        parts: ["modulo_id", "clave"],
      }),
    ).on(t.moduloId, t.clave),
    unique(
      generateConstraintName({
        table: "aplicaciones",
        kind: "uq",
        parts: ["modulo_id", "slug"],
      }),
    ).on(t.moduloId, t.slug),
  ],
);
