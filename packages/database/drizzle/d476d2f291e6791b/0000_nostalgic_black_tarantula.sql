DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('other', 'fallenTree', 'drainage', 'erosion', 'structureFailure', 'damagedSign', 'seasonal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'confirmed', 'inProgress', 'closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_id" text,
	"title" text NOT NULL,
	"description" text,
	"creator" text,
	"stroke" text NOT NULL,
	"updated" timestamp with time zone NOT NULL,
	"geometry" geometry(LineStringZ,4326) NOT NULL,
	CONSTRAINT "routes_original_id_unique" UNIQUE("original_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hazards" (
	"id" serial PRIMARY KEY NOT NULL,
	"local_id" uuid,
	"creator_device_id" text NOT NULL,
	"creator_user_id" text,
	"category" "category" NOT NULL,
	"route" integer NOT NULL,
	"trail" integer NOT NULL,
	"image" text,
	"blur_hash" text,
	"status" "status" DEFAULT 'open' NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"geometry" geometry(PointZ,4326) NOT NULL,
	"description" text NOT NULL,
	"location_description" text,
	CONSTRAINT "hazards_local_id_unique" UNIQUE("local_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"local_id" uuid,
	"creator_device_id" text NOT NULL,
	"creator_user_id" text,
	"category" "category" NOT NULL,
	"route" integer NOT NULL,
	"trail" integer NOT NULL,
	"image" text,
	"blur_hash" text,
	"status" "status" DEFAULT 'open' NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"geometry" geometry(PointZ,4326) NOT NULL,
	CONSTRAINT "reports_local_id_unique" UNIQUE("local_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
