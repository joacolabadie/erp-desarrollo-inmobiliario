import { APLICACION_SCOPE_VALUES } from "@/lib/domain";
import {
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
  (t) => [unique().on(t.clave), unique().on(t.slug)],
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
    scope: aplicacionScopeEnum("scope").notNull(),
  },
  (t) => [unique().on(t.moduloId, t.clave), unique().on(t.moduloId, t.slug)],
);
