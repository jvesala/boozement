CREATE TYPE gender AS ENUM ('M', 'F');

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS servings;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users
(
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email    VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    gender   gender,
    weight   INT          NOT NULL
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users USING btree (email);

CREATE TABLE IF NOT EXISTS servings
(
    id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users (id),
    date    TIMESTAMP WITH TIME ZONE,
    type    VARCHAR(254) NOT NULL,
    amount  INT          NOT NULL,
    units   NUMERIC      NOT NULL,
    tokens  tsvector
);

CREATE INDEX IF NOT EXISTS servings_user_id_idx ON servings USING btree (user_id);

CREATE INDEX IF NOT EXISTS servings_tokens_idx ON servings USING GIN (tokens);

INSERT INTO users VALUES ('acf556cc-72ab-4a04-922b-829116ab7638', 'jussi.vesala@iki.fi','$2b$10$rzoPH7qKbNSzFVsozEbxpOoaTQjuEeBD88OB0QF6v8A.4FbQKiLpW','M', 73000);
