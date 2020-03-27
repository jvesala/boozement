CREATE TYPE gender AS ENUM ('M', 'F');

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS servings;

CREATE TABLE IF NOT EXISTS users
(
    id       SERIAL PRIMARY KEY,
    email    VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    gender   gender,
    weight   INT          NOT NULL
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users USING btree (email);

CREATE TABLE IF NOT EXISTS servings
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    date    TIMESTAMP WITH TIME ZONE,
    type    VARCHAR(254) NOT NULL,
    amount  INT          NOT NULL,
    units   NUMERIC      NOT NULL
);

CREATE INDEX IF NOT EXISTS servings_user_id_idx ON servings USING btree (user_id);
