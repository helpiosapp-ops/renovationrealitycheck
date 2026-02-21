CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type" text NOT NULL,
	"scenarios" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
