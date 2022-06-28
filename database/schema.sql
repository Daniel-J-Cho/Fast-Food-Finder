set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

 CREATE TABLE "public"."locations" (
	"locationId" serial NOT NULL,
	"restaurantName" TEXT NOT NULL,
	"address" TEXT NOT NULL,
  "googlePlaceId" TEXT NOT NULL,
	CONSTRAINT "locations_pk" PRIMARY KEY ("locationId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."comments" (
	"commentId" serial NOT NULL,
	"comment" TEXT NOT NULL,
	"locationId" integer NOT NULL,
	"createdAt" timestamptz NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId");
