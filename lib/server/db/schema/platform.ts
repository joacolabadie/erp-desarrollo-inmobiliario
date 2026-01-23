import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth.generated";

export const platformAdmins = pgTable(
  "platform_admins",
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
    uniqueIndex("platform_admins_usuario_id_key_active")
      .on(t.usuarioId)
      .where(sql`${t.activo} = true`),
  ],
);

export const platformAplicaciones = pgTable(
  "platform_aplicaciones",
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
    uniqueIndex("platform_aplicaciones_clave_key_active")
      .on(t.clave)
      .where(sql`${t.activo} = true`),
  ],
);

export const platformAdminsAplicaciones = pgTable(
  "platform_admins_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    platformAdminId: uuid("platform_admin_id")
      .notNull()
      .references(() => platformAdmins.id, { onDelete: "cascade" }),
    platformAplicacionId: uuid("platform_aplicacion_id")
      .notNull()
      .references(() => platformAplicaciones.id, { onDelete: "restrict" }),
    activo: boolean("activo").default(true).notNull(),
  },
  (t) => [
    uniqueIndex(
      "platform_admins_aplicaciones_platform_admin_id_platform_aplicacion_id_key_active",
    )
      .on(t.platformAdminId, t.platformAplicacionId)
      .where(sql`${t.activo} = true`),
  ],
);
