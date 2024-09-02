ALTER TABLE "email_verification_codes" DROP COLUMN IF EXISTS "id";
ALTER TABLE "email_verification_codes" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "email_mfa_codes" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_mfa_codes" ADD COLUMN "allow_refresh_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "email_mfa" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_mfa" ADD COLUMN "last_attempt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "email_verification_codes" ADD COLUMN "allow_refresh_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "email_verification_codes" ADD COLUMN "auto_refresh_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "totp_mfa" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "totp_mfa" ADD COLUMN "last_attempt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
