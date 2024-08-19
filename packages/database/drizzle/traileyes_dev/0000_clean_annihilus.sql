CREATE TABLE IF NOT EXISTS "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_id" text,
	"title" text NOT NULL,
	"description" text,
	"creator" text,
	"stroke" text NOT NULL,
	"updated" timestamp NOT NULL,
	"geometry" geometry(LineString)
);
