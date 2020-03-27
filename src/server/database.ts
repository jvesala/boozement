import pgPromise from 'pg-promise';
import { IMain } from 'pg-promise';
//import * as pg from 'pg-promise/typescript/pg-subset';

export type Gender = 'M' | 'F';

export type User = {
    id: number;
    email: string;
    password: string;
    gender: Gender;
    weight: number;
};

export const initConnection = (connectionString: string) => {
    const pgp: IMain = pgPromise({});
    return pgp(connectionString);
};

export const getUserById = async (db: any, id: number) => {
    return db
        .any('SELECT * FROM users WHERE id = $1', [id])
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};

export const getUserByEmail = async (db: any, email: string) => {
    return db
        .any('SELECT * FROM users WHERE email = $1', [email])
        .then((data: any[]) => data[0])
        .catch((error: any) => {
            console.log('DB error', error);
            throw error;
        });
};
