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

CREATE INDEX users_email_idx ON users USING btree (email);

DROP TABLE IF EXISTS servings;
CREATE TABLE servings
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    date    TIMESTAMP WITH TIME ZONE,
    type    VARCHAR(254) NOT NULL,
    amount  INT          NOT NULL,
    units   NUMERIC      NOT NULL
);

CREATE INDEX servings_user_id_idx ON servings USING btree (user_id);
