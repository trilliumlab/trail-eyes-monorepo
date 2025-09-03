DROP TABLE "hazards" CASCADE;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "location_description" text;