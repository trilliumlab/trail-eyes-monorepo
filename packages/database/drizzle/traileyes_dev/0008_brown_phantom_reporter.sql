DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('developer', 'superAdmin', 'admin', 'volunteer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"user_id" text NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "roles_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
