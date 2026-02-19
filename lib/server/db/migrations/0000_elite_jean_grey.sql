CREATE TYPE "public"."aplicaciones_scopes" AS ENUM('mixto', 'organizacional', 'proyecto');--> statement-breakpoint
CREATE TYPE "public"."estado_miembro_organizacion" AS ENUM('activo', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."material_tipo" AS ENUM('mano_obra', 'material');--> statement-breakpoint
CREATE TYPE "public"."proyecto_estado" AS ENUM('cancelado', 'en_construccion', 'finalizado', 'planificacion');--> statement-breakpoint
CREATE TYPE "public"."proyecto_tipo" AS ENUM('casa', 'cocheras', 'edificio');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"modulo_id" uuid NOT NULL,
	"clave" text NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"scope" "aplicaciones_scopes" NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modulos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"clave" text NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materiales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "material_tipo" NOT NULL,
	"unidad_medida_id" uuid NOT NULL,
	"stockeable" boolean DEFAULT false NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"aplicacion_id" uuid NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"estado" "estado_miembro_organizacion" DEFAULT 'activo' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"aplicacion_id" uuid NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros_proyectos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizaciones_razones_sociales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre_legal" text NOT NULL,
	"cuit" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unidades_medida" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plataforma_administradores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"usuario_id" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plataforma_administradores_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"plataforma_administrador_id" uuid NOT NULL,
	"plataforma_aplicacion_id" uuid NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plataforma_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"clave" text NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "proyecto_tipo" NOT NULL,
	"estado" "proyecto_estado" DEFAULT 'planificacion' NOT NULL,
	"organizacion_razon_social_principal_id" uuid,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos_categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"rubro_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos_razones_sociales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"organizacion_razon_social_id" uuid NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos_rubros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aplicaciones" ADD CONSTRAINT "aplicaciones_modulo_id_modulos_id_fk" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales" ADD CONSTRAINT "materiales_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales" ADD CONSTRAINT "materiales_unidad_medida_id_unidades_medida_id_fk" FOREIGN KEY ("unidad_medida_id") REFERENCES "public"."unidades_medida"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_aplicaciones" ADD CONSTRAINT "organizaciones_aplicaciones_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_aplicaciones" ADD CONSTRAINT "organizaciones_aplicaciones_aplicacion_id_aplicaciones_id_fk" FOREIGN KEY ("aplicacion_id") REFERENCES "public"."aplicaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ADD CONSTRAINT "organizaciones_miembros_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ADD CONSTRAINT "organizaciones_miembros_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones_aplicacion_id_aplicaciones_id_fk" FOREIGN KEY ("aplicacion_id") REFERENCES "public"."aplicaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_razones_sociales" ADD CONSTRAINT "organizaciones_razones_sociales_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unidades_medida" ADD CONSTRAINT "unidades_medida_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores" ADD CONSTRAINT "plataforma_administradores_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores_aplicaciones" ADD CONSTRAINT "plataforma_administradores_aplicaciones_plataforma_administrador_id_plataforma_administradores_id_fk" FOREIGN KEY ("plataforma_administrador_id") REFERENCES "public"."plataforma_administradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores_aplicaciones" ADD CONSTRAINT "plataforma_administradores_aplicaciones_plataforma_aplicacion_id_plataforma_aplicaciones_id_fk" FOREIGN KEY ("plataforma_aplicacion_id") REFERENCES "public"."plataforma_aplicaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_organizacion_razon_social_principal_id_organizaciones_razones_sociales_id_fk" FOREIGN KEY ("organizacion_razon_social_principal_id") REFERENCES "public"."organizaciones_razones_sociales"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias_rubro_id_proyectos_rubros_id_fk" FOREIGN KEY ("rubro_id") REFERENCES "public"."proyectos_rubros"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales_organizacion_razon_social_id_organizaciones_razones_sociales_id_fk" FOREIGN KEY ("organizacion_razon_social_id") REFERENCES "public"."organizaciones_razones_sociales"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_rubros" ADD CONSTRAINT "proyectos_rubros_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_rubros" ADD CONSTRAINT "proyectos_rubros_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "aplicaciones_modulo_id_clave_key_active" ON "aplicaciones" USING btree ("modulo_id","clave") WHERE "aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "aplicaciones_modulo_id_slug_key_active" ON "aplicaciones" USING btree ("modulo_id","slug") WHERE "aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "modulos_clave_key_active" ON "modulos" USING btree ("clave") WHERE "modulos"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "modulos_slug_key_active" ON "modulos" USING btree ("slug") WHERE "modulos"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "materiales_organizacion_id_nombre_key_active" ON "materiales" USING btree ("organizacion_id","nombre") WHERE "materiales"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_aplicaciones_organizacion_id_aplicacion_id_key_active" ON "organizaciones_aplicaciones" USING btree ("organizacion_id","aplicacion_id") WHERE "organizaciones_aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_miembros_organizacion_id_usuario_id_key_active" ON "organizaciones_miembros" USING btree ("organizacion_id","usuario_id") WHERE "organizaciones_miembros"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_miembros_aplicaciones_organizacion_id_usuario_id_aplicacion_id_key_active" ON "organizaciones_miembros_aplicaciones" USING btree ("organizacion_id","usuario_id","aplicacion_id") WHERE "organizaciones_miembros_aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_miembros_proyectos_organizacion_id_usuario_id_proyecto_id_key_active" ON "organizaciones_miembros_proyectos" USING btree ("organizacion_id","usuario_id","proyecto_id") WHERE "organizaciones_miembros_proyectos"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_razones_sociales_organizacion_id_cuit_key_active" ON "organizaciones_razones_sociales" USING btree ("organizacion_id","cuit") WHERE "organizaciones_razones_sociales"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "unidades_medida_organizacion_id_codigo_key_active" ON "unidades_medida" USING btree ("organizacion_id","codigo") WHERE "unidades_medida"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "unidades_medida_organizacion_id_nombre_key_active" ON "unidades_medida" USING btree ("organizacion_id","nombre") WHERE "unidades_medida"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "plataforma_administradores_usuario_id_key_active" ON "plataforma_administradores" USING btree ("usuario_id") WHERE "plataforma_administradores"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "plataforma_administradores_aplicaciones_plataforma_administrador_id_plataforma_aplicacion_id_key_active" ON "plataforma_administradores_aplicaciones" USING btree ("plataforma_administrador_id","plataforma_aplicacion_id") WHERE "plataforma_administradores_aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "plataforma_aplicaciones_clave_key_active" ON "plataforma_aplicaciones" USING btree ("clave") WHERE "plataforma_aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "plataforma_aplicaciones_slug_key_active" ON "plataforma_aplicaciones" USING btree ("slug") WHERE "plataforma_aplicaciones"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "proyectos_organizacion_id_nombre_key_active" ON "proyectos" USING btree ("organizacion_id","nombre") WHERE "proyectos"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "proyectos_categorias_proyecto_id_nombre_key_active" ON "proyectos_categorias" USING btree ("proyecto_id","nombre") WHERE "proyectos_categorias"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "proyectos_razones_sociales_proyecto_id_organizacion_razon_social_id_key_active" ON "proyectos_razones_sociales" USING btree ("proyecto_id","organizacion_razon_social_id") WHERE "proyectos_razones_sociales"."activo" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "proyectos_rubros_proyecto_id_nombre_key_active" ON "proyectos_rubros" USING btree ("proyecto_id","nombre") WHERE "proyectos_rubros"."activo" = true;