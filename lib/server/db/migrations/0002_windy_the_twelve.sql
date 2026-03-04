CREATE TYPE "public"."estado_invitacion_organizacion" AS ENUM('pendiente', 'aceptada', 'revocada', 'expirada');--> statement-breakpoint
CREATE TABLE "organizaciones_invitaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"rol" "rol_miembro_organizacion" DEFAULT 'miembro' NOT NULL,
	"estado" "estado_invitacion_organizacion" DEFAULT 'pendiente' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizaciones_invitaciones" ADD CONSTRAINT "organizaciones_invitaciones_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_invitaciones_organizacion_id_email_pendiente_key_active" ON "organizaciones_invitaciones" USING btree ("organizacion_id","email") WHERE "organizaciones_invitaciones"."estado" = 'pendiente' AND "organizaciones_invitaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_miembros_organizacion_id_dueno_key_active" ON "organizaciones_miembros" USING btree ("organizacion_id") WHERE "organizaciones_miembros"."rol" = 'dueno' AND "organizaciones_miembros"."activo" = true;