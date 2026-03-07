ALTER TABLE "organizaciones_invitaciones" ALTER COLUMN "rol" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "organizaciones_invitaciones" ALTER COLUMN "rol" SET DEFAULT 'miembro'::text;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ALTER COLUMN "rol" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ALTER COLUMN "rol" SET DEFAULT 'miembro'::text;--> statement-breakpoint
DROP TYPE "public"."rol_miembro_organizacion";--> statement-breakpoint
CREATE TYPE "public"."rol_miembro_organizacion" AS ENUM('administrador', 'miembro');--> statement-breakpoint
ALTER TABLE "organizaciones_invitaciones" ALTER COLUMN "rol" SET DEFAULT 'miembro'::"public"."rol_miembro_organizacion";--> statement-breakpoint
ALTER TABLE "organizaciones_invitaciones" ALTER COLUMN "rol" SET DATA TYPE "public"."rol_miembro_organizacion" USING "rol"::"public"."rol_miembro_organizacion";--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ALTER COLUMN "rol" SET DEFAULT 'miembro'::"public"."rol_miembro_organizacion";--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ALTER COLUMN "rol" SET DATA TYPE "public"."rol_miembro_organizacion" USING "rol"::"public"."rol_miembro_organizacion";