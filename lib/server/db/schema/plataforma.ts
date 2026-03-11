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
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
  },
  (t) => [unique().on(t.usuarioId)],
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
  (t) => [unique().on(t.clave), unique().on(t.slug)],
);

export const plataformaAdministradoresAplicaciones = pgTable(
  "plataforma_administradores_aplicaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .defaultNow()
      .notNull(),
    plataformaAdministradorId: uuid("plataforma_administrador_id").notNull(),
    plataformaAplicacionId: uuid("plataforma_aplicacion_id")
      .notNull()
      .references(() => plataformaAplicaciones.id, { onDelete: "restrict" }),
  },
  (t) => [
    foreignKey({
      name: "manual_plataforma_administradores_aplicaciones_plataforma_administrador_id_fkey",
      columns: [t.plataformaAdministradorId],
      foreignColumns: [plataformaAdministradores.id],
    }).onDelete("restrict"),
    unique().on(t.plataformaAdministradorId, t.plataformaAplicacionId),
  ],
);
