ALTER TABLE "email_mfa" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "totp_mfa" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "email_mfa" DROP CONSTRAINT "email_mfa_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "totp_mfa" DROP CONSTRAINT "totp_mfa_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_mfa" ADD CONSTRAINT "email_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "totp_mfa" ADD CONSTRAINT "totp_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
