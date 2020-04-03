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

export const insertUser = async (db: any, user: User) => {
    return db
        .any(
            'INSERT INTO users (email, password, gender, weight) VALUES (${email}, ${password}, ${gender}, ${weight}) RETURNING id',
            user
        )
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};

export const getUserById = async (
    db: any,
    id: number
): Promise<User | undefined> => {
    return db
        .any('SELECT * FROM users WHERE id = $1', [id])
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};

export const getUserByEmail = async (
    db: any,
    email: string
): Promise<User | undefined> => {
    return db
        .any('SELECT * FROM users WHERE email = $1', [email])
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};

export const insertServing = async (db: any, serving: Serving) => {
    return db
        .any(
            'INSERT INTO servings (user_id, date, type, amount, units) VALUES (${userId}, ${date}, ${type}, ${amount}, ${units}) RETURNING id',
            serving
        )
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};

export const getServings = async (
    db: any,
    userId: number
): Promise<Serving[]> => {
    return db
        .any(
            'SELECT id, user_id, date, type, amount, units FROM servings WHERE user_id = $1',
            [userId]
        )
        .then((data: any[]) => {
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
        })
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};
