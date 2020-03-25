import passport from 'passport';
import passportLocal from 'passport-local';
import { NextFunction, Response, Request } from 'express';
const LocalStrategy = passportLocal.Strategy;

export const initPassport = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            // @ts-ignore
            (req: any, email: any, password: any, done: any) => {
                done(null, { email: 'jussi.vesala@iki.fi', id: 1 });
            }
        )
    );

    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
        done(undefined, { email: 'jussi.vesala@iki.fi', id });
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
