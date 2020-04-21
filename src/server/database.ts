import pgPromise, { IMain } from 'pg-promise';
import { DateTime } from 'luxon';
//import * as pg from 'pg-promise/typescript/pg-subset';

export type Gender = 'M' | 'F';

export type User = {
    id?: string;
    email: string;
    password: string;
    gender: Gender;
    weight: number;
};

export type Serving = {
    id?: string;
    userId: string;
    date: DateTime;
    type: string;
    amount: number;
    units: number;
};

export type ServingsResponse = {
    servings: Serving[];
    totalCount: number;
    totalUnits: number;
};

export const initConnection = (connectionString: string) => {
    const pgp: IMain = pgPromise({});
    var types = pgp.pg.types;
    types.setTypeParser(1184, str => str);
    return { pgp, db: pgp(connectionString) };
};

const handleDbError = (methodName: string) => (error: any) => {
    console.log(`PostgreSQL error in ${methodName}`, error);
    throw error;
};

export const mapRowsToServices = (data: any[]) => {
    return data.map(val => {
        return {
            id: val.id,
            userId: val.user_id,
            date: DateTime.fromSQL(val.date).toUTC(),
            type: val.type,
            amount: val.amount,
            units: parseFloat(val.units)
        };
    });
};

export const mapRowsToServicesResponse = (data: any[]) => {
    const first = data[0];
    const totalCount = first ? parseInt(first.totalcount) : 0;
    const totalUnits = first ? parseFloat(first.totalunits) : 0;

    const servings = data.map(val => {
        return {
            id: val.id,
            userId: val.user_id,
            date: DateTime.fromSQL(val.date).toUTC(),
            type: val.type,
            amount: val.amount,
            units: parseFloat(val.units)
        };
    });
    return { totalCount, totalUnits, servings };
};

export const insertUser = async (db: any, user: User) => {
    return db
        .any(
            'INSERT INTO users (email, password, gender, weight) VALUES (${email}, ${password}, ${gender}, ${weight}) RETURNING id',
            user
        )
        .then((data: any[]) => data[0])
        .catch(handleDbError('insertUser'));
};

export const getUserById = async (
    db: any,
    id: string
): Promise<User | null> => {
    return db
        .oneOrNone(
            'SELECT id, email, password, gender, weight FROM users WHERE id = $1',
            [id]
        )
        .catch(handleDbError('getUserById'));
};

export const getUserByEmail = async (
    db: any,
    email: string
): Promise<User | null> => {
    return db
        .oneOrNone(
            'SELECT id, email, password, gender, weight FROM users WHERE email = $1',
            [email]
        )
        .catch(handleDbError('getUserByEmail'));
};

export const insertServing = async (db: any, serving: Serving) => {
    return db
        .any(
            `
WITH created_token AS (
  SELECT
    setweight(to_tsvector('simple', lower(\${type})), 'A') ||
    setweight(to_tsvector('simple', to_char(\${date}::timestamptz, 'YYYY:DD:MM')), 'B') ||
    setweight(to_tsvector('simple', to_char(\${date}::timestamptz, 'HH24:MI')), 'C') ||
    setweight(to_tsvector('simple', to_char(\${date}::timestamptz, 'HH12:MI')), 'D')
    AS tokens
    )
INSERT INTO servings (user_id, date, type, amount, units, tokens)
  SELECT \${userId}, \${date}, \${type}, \${amount}, \${units}, tokens
  FROM created_token
RETURNING id`,
            serving
        )
        .then((data: any[]) => data[0])
        .catch(handleDbError('insertServing'));
};

export const updateField = async (
    db: any,
    userId: string,
    id: string,
    field: string,
    value: string
) => {
    return db
        .tx(async (t: any) => {
            await t.none(
                'UPDATE servings SET ${field~} = ${value} WHERE id = ${id} AND user_id = ${userId}',
                { userId, id, field, value }
            );
            const result = await t.one(
                `
UPDATE servings
  SET tokens = setweight(to_tsvector('simple', lower(type)), 'A') ||
               setweight(to_tsvector('simple', to_char(date, 'YYYY:DD:MM')), 'B') ||
               setweight(to_tsvector('simple', to_char(date, 'HH24:MI')), 'C') ||
               setweight(to_tsvector('simple', to_char(date, 'HH12:MI')), 'D')
WHERE id = \${id} AND user_id = \${userId}
RETURNING id, user_id, date, type, amount, units
        `,
                { userId, id }
            );
            return [{ ...result }];
        })
        .then(mapRowsToServices)
        .catch(handleDbError('insertServing'));
};

export const getServings = async (
    db: any,
    userId: string,
    limit: number,
    offset: number
): Promise<ServingsResponse> => {
    return db
        .any(
            'SELECT id, user_id, date, type, amount, units, COUNT(id) OVER() AS totalCount, SUM(units) OVER() AS totalUnits FROM servings WHERE user_id = ${userId} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}',
            { userId, limit, offset }
        )
        .then(mapRowsToServicesResponse)
        .catch(handleDbError('getServings'));
};

export const getRecentServings = async (
    db: any,
    userId: string,
    hours: number
): Promise<Serving[]> => {
    return db
        .any(
            "SELECT id, user_id, date, type, amount, units, COUNT(id) OVER() AS totalCount, SUM(units) OVER() AS totalUnits FROM servings WHERE user_id = ${userId} and date >= NOW() - INTERVAL '${hours} HOURS' ORDER BY date DESC",
            { userId, hours }
        )
        .then(mapRowsToServicesResponse)
        .catch(handleDbError('getRecentServings'));
};

export const searchServings = async (
    db: any,
    userId: string,
    search: string,
    limit: number,
    offset: number
): Promise<ServingsResponse> => {
    const searchFormatted =
        search
            .trim()
            .toLowerCase()
            .replace(' ', ':* & ') + ':*';
    return db
        .any(
            'SELECT id, user_id, date, type, amount, units, COUNT(id) OVER() AS totalCount, SUM(units) OVER() AS totalUnits FROM servings WHERE user_id = ${userId} AND tokens @@ to_tsquery(${searchFormatted}) ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}',
            { userId, searchFormatted, limit, offset }
        )
        .then(mapRowsToServicesResponse)
        .catch(handleDbError('getServings'));
};
