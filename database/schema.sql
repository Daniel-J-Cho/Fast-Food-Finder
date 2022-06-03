set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

 CREATE TABLE "public.locations" (
	"locationId" serial NOT NULL,
	"restaurantName" TEXT NOT NULL,
	"lat" float8 NOT NULL,
	"lng" float8 NOT NULL,
	"address" TEXT NOT NULL,
	"googlePlaceId" TEXT NOT NULL,
	CONSTRAINT "locations_pk" PRIMARY KEY ("locationId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.comments" (
	"commentId" serial NOT NULL,
	"comment" TEXT NOT NULL,
	"entryId" integer NOT NULL,
	"createdAt" timestamptz NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.favoriteEntries" (
	"entryId" serial NOT NULL,
	"locationId" integer NOT NULL,
	"comment" TEXT NOT NULL,
	"logoUrl" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL,
	CONSTRAINT "favoriteEntries_pk" PRIMARY KEY ("entryId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("entryId") REFERENCES "favoriteEntries"("entryId");

ALTER TABLE "favoriteEntries" ADD CONSTRAINT "favoriteEntries_fk0" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId");
