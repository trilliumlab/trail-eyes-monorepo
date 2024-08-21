CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now() NOT NULL,
	"last_update_date" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_date" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "hazards" ADD COLUMN "creator_device_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hazards" ADD COLUMN "creator_user_id" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "creator_device_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "creator_user_id" text;--> statement-breakpoint
ALTER TABLE "hazards" DROP COLUMN IF EXISTS "creator_id";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN IF EXISTS "creator_id";
