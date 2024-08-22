ALTER TYPE "status" RENAME TO "status_old";--> statement-breakpoint

CREATE TYPE "public"."status" AS ENUM('open', 'confirmed', 'inProgress', 'closed');

ALTER TABLE "hazards" DROP COLUMN "status";
ALTER TABLE "reports" DROP COLUMN "status";

ALTER TABLE "hazards" ADD COLUMN "status" status DEFAULT 'open' NOT NULL;
ALTER TABLE "reports" ADD COLUMN "status" status DEFAULT 'open' NOT NULL;

DROP TYPE "status_old";
