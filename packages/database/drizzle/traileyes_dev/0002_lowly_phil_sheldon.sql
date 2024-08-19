ALTER TABLE "routes" ALTER COLUMN "geometry" SET DATA TYPE geometry(LineStringZ,4326);--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "geometry" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_original_id_unique" UNIQUE("original_id");