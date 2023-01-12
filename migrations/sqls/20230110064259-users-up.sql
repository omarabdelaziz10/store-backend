CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username varchar(64) NOT NULL,
    first_name varchar(64) NOT NULL,
    last_name varchar(64) NOT NULL,
    password_digest varchar NOT NULL
);