ALTER TYPE "role" ADD VALUE 'member';--> statement-breakpoint
DROP TABLE "roles";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'member' NOT NULL;