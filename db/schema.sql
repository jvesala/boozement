CREATE TYPE gender AS ENUM ('M', 'F');

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    email    VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    gender   gender,
    weight   INT          NOT NULL
);

DROP TABLE IF EXISTS servings;
CREATE TABLE servings
(
    id     SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(id),
    date   TIMESTAMP WITH TIME ZONE,
    type   VARCHAR(254) NOT NULL,
    amount INT          NOT NULL,
    units  NUMERIC      NOT NULL
);
