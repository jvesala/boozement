import { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import { initPassport } from './passportUtils';
import { initConnection } from './database';

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
//const connectionString = 'jdbc:postgresql://boozement-postgres:5432/boozement';
const connectionString = 'postgres://postgres:@boozement-postgres:5432/boozement';

const db = initConnection(connectionString);
initPassport(db);
app.use(passport.initialize());
app.use(passport.session());

app.get('/servings', (_req: Request, res: Response) => {
    res.send({ express: 'Hello From Express' });
});

app.post(
    '/login',
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        console.log('POST /login', req.user);
        const { user } = req;
        res.json(user);
    }
);

app.listen(port, () => console.log(`Listening on port ${port}`));
