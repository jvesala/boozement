import pgPromise, { IMain } from 'pg-promise';
import { DateTime } from 'luxon';
//import * as pg from 'pg-promise/typescript/pg-subset';

export type Gender = 'M' | 'F';

export type User = {
    id?: number;
    email: string;
    password: string;
    gender: Gender;
    weight: number;
};

export type Serving = {
    id?: number;
    userId: number;
    date: DateTime;
    type: string;
    amount: number;
    units: number;
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
    id: number
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
            'INSERT INTO servings (user_id, date, type, amount, units) VALUES (${userId}, ${date}, ${type}, ${amount}, ${units}) RETURNING id',
            serving
        )
        .then((data: any[]) => data[0])
        .catch(handleDbError('insertServing'));
};

export const updateField = async (
    db: any,
    id: string,
    field: string,
    value: string
) => {
    return db
        .any(
            'UPDATE servings SET ${field~} = ${value} WHERE id = ${id} RETURNING user_id, date, type, amount, units',
            { field, value, id }
        )
        .then((data: any[]) => data[0])
        .catch(handleDbError('insertServing'));
};

export const getServings = async (
    db: any,
    userId: number,
    limit: number,
    offset: number
): Promise<Serving[]> => {
    return db
        .any(
            'SELECT id, user_id, date, type, amount, units FROM servings WHERE user_id = ${userId} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}',
            { userId, limit, offset }
        )
        .then(mapRowsToServices)
        .catch(handleDbError('getServings'));
};

export const getRecentServings = async (
    db: any,
    userId: number,
    hours: number
): Promise<Serving[]> => {
    return db
        .any(
            "SELECT id, user_id, date, type, amount, units FROM servings WHERE user_id = ${userId} and date >= NOW() - INTERVAL '${hours} HOURS' ORDER BY date DESC",
            { userId, hours }
        )
        .then(mapRowsToServices)
        .catch(handleDbError('getRecentServings'));
};
