import { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import { initPassport } from './passportUtils';

const express = require('express');
const bodyparser = require('body-parser');

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(
    session({
        name: 'boozement_cookie',
        resave: false,
        saveUninitialized: false,
        secret: 'topSecretSession'
    })
);
initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/servings', (_req: Request, res: Response) => {
    res.send({ express: 'Hello From Express' });
});

//app.post('/login', (req: Request, res: Response) => {
app.post(
    '/login2',
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        console.log('POST /login', req);
        //res.send({ status: 'success', email: req.body.email });
        const { user } = req;
        res.json(user);
    }
);

app.post('/login', function(req: any, res: any, next: any) {
    passport.authenticate('local', function(err, user, info) {
        console.log('authenticate callback');
        if (err) {
            return res.send({ status: 'err', message: err.message });
        }
        if (!user) {
            return res.send({ status: 'fail', message: info.message });
        }
        req.logIn(user, function(err: any) {
            if (err) {
                return res.send({ status: 'err', message: err.message });
            }
            return res.send({ status: 'ok' });
        });
    })(req, res, next);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
