import { users } from "@/lib/server/db/schema/auth.generated";
import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const plataformaAdministradores = pgTable(
  "plataforma_administradores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("plataforma_administradores_usuario_id_key_active")
      .on(t.usuarioId)
      .where(sql`${t.activo} = true`),
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
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex("plataforma_aplicaciones_clave_key_active")
      .on(t.clave)
      .where(sql`${t.activo} = true`),
    uniqueIndex("plataforma_aplicaciones_slug_key_active")
      .on(t.slug)
      .where(sql`${t.activo} = true`),
  ],
);

export const plataformaAdministradoresAplicaciones = pgTable(
  "plataforma_administradores_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    plataformaAdministradorId: uuid("plataforma_administrador_id")
      .notNull()
      .references(() => plataformaAdministradores.id, { onDelete: "cascade" }),
    plataformaAplicacionId: uuid("plataforma_aplicacion_id")
      .notNull()
      .references(() => plataformaAplicaciones.id, { onDelete: "restrict" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "plataforma_administradores_aplicaciones_plataforma_administrador_id_plataforma_aplicacion_id_key_active",
    )
      .on(t.plataformaAdministradorId, t.plataformaAplicacionId)
      .where(sql`${t.activo} = true`),
  ],
);
