-- DANGER: this is NOT how to do it in the real world.
-- You should NEVER EVER check user data into Git!

insert into "users" ("username", "hashedPassword")
values ('Guest', '$argon2i$v=19$m=4096,t=3,p=1$+GQRQAm9DwMtTolADfHPxw$jBOD5eFDvU+IFo6e7K+PoUqNny6So/Y0cQhLvIi8Q1k');
