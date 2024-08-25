DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('developer', 'superAdmin', 'admin', 'volunteer', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "email_mfa_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" varchar(6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_mfa" (
	"user_id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invites_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwords" (
	"user_id" text PRIMARY KEY NOT NULL,
	"hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "totp_mfa" (
	"user_id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now() NOT NULL,
	"last_update_date" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_date" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_id" text,
	"title" text NOT NULL,
	"description" text,
	"creator" text,
	"stroke" text NOT NULL,
	"updated" timestamp NOT NULL,
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
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
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
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"geometry" geometry(PointZ,4326) NOT NULL,
	CONSTRAINT "reports_local_id_unique" UNIQUE("local_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_mfa_codes" ADD CONSTRAINT "email_mfa_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_mfa" ADD CONSTRAINT "email_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "totp_mfa" ADD CONSTRAINT "totp_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
