CREATE TYPE "public"."aplicacion_scope" AS ENUM('mixto', 'organizacional', 'proyecto');--> statement-breakpoint
CREATE TYPE "public"."invitacion_organizacion_estado" AS ENUM('aceptada', 'expirada', 'pendiente', 'revocada');--> statement-breakpoint
CREATE TYPE "public"."material_tipo" AS ENUM('mano_obra', 'material');--> statement-breakpoint
CREATE TYPE "public"."miembro_organizacion_estado" AS ENUM('activo', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."miembro_organizacion_rol" AS ENUM('administrador', 'miembro');--> statement-breakpoint
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
	"scope" "aplicacion_scope" NOT NULL,
	CONSTRAINT "aplicaciones__uq__125965f52a" UNIQUE("modulo_id","clave"),
	CONSTRAINT "aplicaciones__uq__ed10ade698" UNIQUE("modulo_id","slug")
);
--> statement-breakpoint
CREATE TABLE "modulos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"clave" text NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "modulos__uq__ed319c54f5" UNIQUE("clave"),
	CONSTRAINT "modulos__uq__df54a5f7b4" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "materiales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "material_tipo" NOT NULL,
	"unidad_medida_id" uuid NOT NULL,
	"stockeable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "materiales__uq__f0fe787d29" UNIQUE("organizacion_id","nombre")
);
--> statement-breakpoint
CREATE TABLE "organizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"identificador_cliente" text NOT NULL,
	"nombre" text NOT NULL,
	"limite_proyectos" integer NOT NULL,
	CONSTRAINT "organizaciones__uq__39c46b65c9" UNIQUE("identificador_cliente")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"aplicacion_id" uuid NOT NULL,
	CONSTRAINT "organizaciones_aplicaciones__uq__1ef6619111" UNIQUE("organizacion_id","aplicacion_id")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_invitaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"email" text NOT NULL,
	"rol" "miembro_organizacion_rol" DEFAULT 'miembro' NOT NULL,
	"token_hash" text NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"estado" "invitacion_organizacion_estado" DEFAULT 'pendiente' NOT NULL,
	CONSTRAINT "organizaciones_invitaciones__uq__6518f81ef0" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"rol" "miembro_organizacion_rol" DEFAULT 'miembro' NOT NULL,
	"estado" "miembro_organizacion_estado" DEFAULT 'activo' NOT NULL,
	CONSTRAINT "organizaciones_miembros__uq__6ff6b34278" UNIQUE("organizacion_id","usuario_id")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"aplicacion_id" uuid NOT NULL,
	CONSTRAINT "organizaciones_miembros_aplicaciones__uq__c7ff589836" UNIQUE("organizacion_id","usuario_id","aplicacion_id")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_miembros_proyectos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"usuario_id" text NOT NULL,
	"proyecto_id" uuid NOT NULL,
	CONSTRAINT "organizaciones_miembros_proyectos__uq__3c5cb297df" UNIQUE("organizacion_id","usuario_id","proyecto_id")
);
--> statement-breakpoint
CREATE TABLE "organizaciones_razones_sociales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre_legal" text NOT NULL,
	"cuit" text NOT NULL,
	CONSTRAINT "organizaciones_razones_sociales__uq__42fe101a29" UNIQUE("organizacion_id","id"),
	CONSTRAINT "organizaciones_razones_sociales__uq__f1ad38dee1" UNIQUE("organizacion_id","cuit")
);
--> statement-breakpoint
CREATE TABLE "unidades_medida" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "unidades_medida__uq__c29303166e" UNIQUE("organizacion_id","id"),
	CONSTRAINT "unidades_medida__uq__aa69766fc9" UNIQUE("organizacion_id","codigo"),
	CONSTRAINT "unidades_medida__uq__d2e0350f00" UNIQUE("organizacion_id","nombre")
);
--> statement-breakpoint
CREATE TABLE "plataforma_administradores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"usuario_id" text NOT NULL,
	CONSTRAINT "plataforma_administradores__uq__c093b02a47" UNIQUE("usuario_id")
);
--> statement-breakpoint
CREATE TABLE "plataforma_administradores_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"plataforma_administrador_id" uuid NOT NULL,
	"plataforma_aplicacion_id" uuid NOT NULL,
	CONSTRAINT "plataforma_administradores_aplicaciones__uq__7bca4e3d1d" UNIQUE("plataforma_administrador_id","plataforma_aplicacion_id")
);
--> statement-breakpoint
CREATE TABLE "plataforma_aplicaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"clave" text NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "plataforma_aplicaciones__uq__2cbb7ac640" UNIQUE("clave"),
	CONSTRAINT "plataforma_aplicaciones__uq__7404e3395f" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "proyecto_tipo" NOT NULL,
	"estado" "proyecto_estado" DEFAULT 'planificacion' NOT NULL,
	CONSTRAINT "proyectos__uq__9a27922a60" UNIQUE("organizacion_id","id"),
	CONSTRAINT "proyectos__uq__61ea8320be" UNIQUE("organizacion_id","nombre")
);
--> statement-breakpoint
CREATE TABLE "proyectos_categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"rubro_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "proyectos_categorias__uq__940e2069ec" UNIQUE("organizacion_id","proyecto_id","nombre")
);
--> statement-breakpoint
CREATE TABLE "proyectos_razones_sociales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"organizacion_razon_social_id" uuid NOT NULL,
	CONSTRAINT "proyectos_razones_sociales__uq__833319a1d2" UNIQUE("organizacion_id","proyecto_id","organizacion_razon_social_id")
);
--> statement-breakpoint
CREATE TABLE "proyectos_rubros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "proyectos_rubros__uq__727d7ce5fc" UNIQUE("organizacion_id","proyecto_id","id"),
	CONSTRAINT "proyectos_rubros__uq__24fb30297a" UNIQUE("organizacion_id","proyecto_id","nombre")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aplicaciones" ADD CONSTRAINT "aplicaciones__fk__0f0590269a" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales" ADD CONSTRAINT "materiales__fk__b3747fe2d5" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales" ADD CONSTRAINT "materiales__fk__3e4ca8dfa2" FOREIGN KEY ("organizacion_id","unidad_medida_id") REFERENCES "public"."unidades_medida"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_aplicaciones" ADD CONSTRAINT "organizaciones_aplicaciones__fk__852d61f824" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_aplicaciones" ADD CONSTRAINT "organizaciones_aplicaciones__fk__f089d5e267" FOREIGN KEY ("aplicacion_id") REFERENCES "public"."aplicaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_invitaciones" ADD CONSTRAINT "organizaciones_invitaciones__fk__274cb82977" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ADD CONSTRAINT "organizaciones_miembros__fk__873c14bf11" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros" ADD CONSTRAINT "organizaciones_miembros__fk__0a46230270" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones__fk__f22d470bbe" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones__fk__d618c66ce9" FOREIGN KEY ("organizacion_id","usuario_id") REFERENCES "public"."organizaciones_miembros"("organizacion_id","usuario_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_aplicaciones" ADD CONSTRAINT "organizaciones_miembros_aplicaciones__fk__1a99e9d05a" FOREIGN KEY ("organizacion_id","aplicacion_id") REFERENCES "public"."organizaciones_aplicaciones"("organizacion_id","aplicacion_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos__fk__2e93dc1f51" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos__fk__9df76de526" FOREIGN KEY ("organizacion_id","usuario_id") REFERENCES "public"."organizaciones_miembros"("organizacion_id","usuario_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_miembros_proyectos" ADD CONSTRAINT "organizaciones_miembros_proyectos__fk__7d17988ba8" FOREIGN KEY ("organizacion_id","proyecto_id") REFERENCES "public"."proyectos"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizaciones_razones_sociales" ADD CONSTRAINT "organizaciones_razones_sociales__fk__a78a1c7d79" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unidades_medida" ADD CONSTRAINT "unidades_medida__fk__f72863a30a" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores" ADD CONSTRAINT "plataforma_administradores__fk__bea820a0fb" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores_aplicaciones" ADD CONSTRAINT "plataforma_administradores_aplicaciones__fk__35716ddade" FOREIGN KEY ("plataforma_administrador_id") REFERENCES "public"."plataforma_administradores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataforma_administradores_aplicaciones" ADD CONSTRAINT "plataforma_administradores_aplicaciones__fk__a159581135" FOREIGN KEY ("plataforma_aplicacion_id") REFERENCES "public"."plataforma_aplicaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos__fk__5b0c902ccd" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias__fk__5c52a75272" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias__fk__971e1dc92a" FOREIGN KEY ("organizacion_id","proyecto_id") REFERENCES "public"."proyectos"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_categorias" ADD CONSTRAINT "proyectos_categorias__fk__b34b2600a3" FOREIGN KEY ("organizacion_id","proyecto_id","rubro_id") REFERENCES "public"."proyectos_rubros"("organizacion_id","proyecto_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales__fk__5f7c4ebad6" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales__fk__f2d31f4b70" FOREIGN KEY ("organizacion_id","proyecto_id") REFERENCES "public"."proyectos"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_razones_sociales" ADD CONSTRAINT "proyectos_razones_sociales__fk__86f7f4d79b" FOREIGN KEY ("organizacion_id","organizacion_razon_social_id") REFERENCES "public"."organizaciones_razones_sociales"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_rubros" ADD CONSTRAINT "proyectos_rubros__fk__8829c79917" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_rubros" ADD CONSTRAINT "proyectos_rubros__fk__cde46fa137" FOREIGN KEY ("organizacion_id","proyecto_id") REFERENCES "public"."proyectos"("organizacion_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "organizaciones_invitaciones__uqx__32b25d821a" ON "organizaciones_invitaciones" USING btree ("organizacion_id","email") WHERE "organizaciones_invitaciones"."estado" = 'pendiente';