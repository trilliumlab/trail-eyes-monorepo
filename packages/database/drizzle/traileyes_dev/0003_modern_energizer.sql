DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('other', 'fallenTree', 'drainage', 'erosion', 'structureFailure', 'damagedSign', 'seasonal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"category" "category" NOT NULL,
	"route" integer NOT NULL,
	"trail" integer NOT NULL,
	"image" text,
	"blur_hash" text,
	"active" boolean DEFAULT true NOT NULL,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"geometry" geometry(PointZ,4326) NOT NULL,
	CONSTRAINT "reports_uuid_unique" UNIQUE("uuid")
);
