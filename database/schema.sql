set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

 CREATE TABLE "public"."users" (
	 "userId"						serial 						NOT NULL,
	 "username"					TEXT							NOT NULL,
	 "hashedPassword"		TEXT							NOT NULL,
	 "createdAt"				timestamptz(6)		NOT NULL default now(),
	 CONSTRAINT "users_pk" PRIMARY KEY ("userId")
 ) WITH (
	 OIDS=FALSE
 );


 CREATE TABLE "public"."locations" (
	"entryId" 				serial 						NOT NULL,
	"restaurantName" 		TEXT 							NOT NULL,
	"address" 					TEXT 							NOT NULL,
  "googlePlaceId" 		TEXT 							NOT NULL,
	"userId" 						INTEGER 					NOT NULL,
	CONSTRAINT "locations_pk" PRIMARY KEY ("entryId")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."comments" (
	"commentId" 				serial 						NOT NULL,
	"comment" 					TEXT 							NOT NULL,
	"entryId" 				  INTEGER 					NOT NULL,
	"createdAt" 				timestamptz 			NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "locations" ADD CONSTRAINT "locations_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("entryId") REFERENCES "locations"("entryId") ON DELETE CASCADE;
