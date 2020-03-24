import passport from 'passport';
import passportLocal from 'passport-local';
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
