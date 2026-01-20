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

export const aplicacionesScopeEnum = pgEnum("aplicaciones_scopes", [
  "organizacional",
  "proyecto",
  "mixto",
]);

export const modulos = pgTable(
  "modulos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    clave: text("clave").notNull(),
    nombre: text("nombre").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("modulos_clave_key_active")
      .on(t.clave)
      .where(sql`${t.activo} = true`),
  ],
);

export const aplicaciones = pgTable(
  "aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    moduloId: uuid("modulo_id")
      .notNull()
      .references(() => modulos.id, { onDelete: "restrict" }),
    clave: text("clave").notNull(),
    slug: text("slug").notNull(),
    nombre: text("nombre").notNull(),
    scope: aplicacionesScopeEnum("scope").notNull(),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("aplicaciones_modulo_id_clave_key_active")
      .on(t.moduloId, t.clave)
      .where(sql`${t.activo} = true`),
  ],
);
