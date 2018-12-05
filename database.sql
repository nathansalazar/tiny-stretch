CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    username VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE park (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(255) NOT NULL,
	latitude DECIMAL NOT NULL,
	longitude DECIMAL NOT NULL,
	GoogleID VARCHAR(511),
	photo_reference VARCHAR(511),
	"state" VARCHAR(5),
	added_by INTEGER
	); 
	
CREATE TABLE states (
	id SERIAL PRIMARY KEY,
	postal_code VARCHAR(5),
	center_lat DECIMAL,
	center_lng DECIMAL,
	zoom INTEGER, 
    full_name VARCHAR(32)
);
--the data for this table can be imported from the 'states.csv' file

CREATE TABLE "park_description" (
park_id INT NOT NULL,
"description" TEXT[] NOT NULL,
user_id INT[] NOT NULL );