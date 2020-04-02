import pgPromise from 'pg-promise';
import { IMain } from 'pg-promise';
//import * as pg from 'pg-promise/typescript/pg-subset';

export type Gender = 'M' | 'F';

export type User = {
    id?: number;
    email: string;
    password: string;
    gender: Gender;
    weight: number;
};

export const initConnection = (connectionString: string) => {
    const pgp: IMain = pgPromise({});
    return pgp(connectionString);
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
