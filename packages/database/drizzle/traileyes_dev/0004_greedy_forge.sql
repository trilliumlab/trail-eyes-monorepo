DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('closed', 'open', 'inProgress');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hazards" (
	"id" serial PRIMARY KEY NOT NULL,
	"local_id" uuid,
	"creator_id" text NOT NULL,
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
ALTER TABLE "reports" RENAME COLUMN "uuid" TO "local_id";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_uuid_unique";--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "creator_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "status" "status" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN IF EXISTS "active";--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_local_id_unique" UNIQUE("local_id");
