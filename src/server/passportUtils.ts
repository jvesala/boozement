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
                passReqToCallback: true
            },
            (_req: any, email: any, password: any, done: any) => {
                getUserByEmail(db, email).then(user => {
                    bcrypt.compare(
                        password,
                        user?.password ? user.password : '',
                        function(err: Error, result: boolean) {
                            if (result) {
                                done(undefined, user);
                            } else {
                                done(err, undefined);
                            }
                            done(undefined, user);
                        }
                    );
                });
            }
        )
    );

    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
        getUserById(db, id as string).then(user => {
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
    // else res.sendStatus(401)
    else res.redirect('/');
};
