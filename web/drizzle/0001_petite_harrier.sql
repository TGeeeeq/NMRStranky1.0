CREATE TABLE "game_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"note" varchar(200),
	"redeem_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_redeemed_at" timestamp,
	"revoked_at" timestamp,
	CONSTRAINT "game_invites_code_unique" UNIQUE("code")
);
