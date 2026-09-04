ALTER TYPE "public"."account_tier" ADD VALUE '4';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "staff_approved" boolean NOT NULL DEFAULT false;