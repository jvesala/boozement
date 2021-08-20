import passport from 'passport';
import passportLocal from 'passport-local';
import { NextFunction, Request, Response } from 'express';
import pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { getUserByEmail, getUserById } from './database';
import * as bcrypt from 'bcrypt';

const LocalStrategy = passportLocal.Strategy;

export const initPassport = (db: pgPromise.IDatabase<{}, pg.IClient>) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            (_req: any, email: any, password: any, done: any) => {
                getUserByEmail(db, email).then((user) => {
                    bcrypt.compare(
                        password,
                        user?.password ? user.password : '',
                        function (err: Error | undefined, result: boolean) {
                            if (result) {
                                done(undefined, user);
                            } else {
                                done(err, undefined);
                            }
                        }
                    );
                });
            }
        )
    );

    passport.serializeUser<string>((user: Express.User, done: (err: any, id?: string) => void) => {
        done(undefined, (user as any).id);
    });

    passport.deserializeUser<string>((id, done) => {
        getUserById(db, id).then((user) => {
            done(undefined, user);
        });
    });
};

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) return next();
    else res.sendStatus(401);
};

export const hashPassword = async (plaintext: string): Promise<string> => {
    return bcrypt.hash(plaintext, 10);
};
