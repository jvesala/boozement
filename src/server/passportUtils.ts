import passport from 'passport';
import passportLocal from 'passport-local';
import { NextFunction, Response, Request } from 'express';
import pgPromise from 'pg-promise';
import * as pg from 'pg-promise/typescript/pg-subset';
import { getUserByEmail, getUserById } from './database';

const LocalStrategy = passportLocal.Strategy;

export const initPassport = (db: pgPromise.IDatabase<{}, pg.IClient>) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            // @ts-ignore
            (req: any, email: any, password: any, done: any) => {
                getUserByEmail(db, email).then(
                    user => {
                        console.log("USER", user);
                        done(undefined, user);
                    }
                );
            }
        )
    );

    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
        getUserById(db, parseInt(id as any, 10)).then(
            user => {
                done(undefined, user);
            }
        );
    });
};

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) return next();
    else res.redirect('/login');
};
